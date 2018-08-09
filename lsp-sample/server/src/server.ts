/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	createConnection, TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	ProposedFeatures, InitializeParams, DidChangeConfigurationNotification, CompletionItem,
	CompletionItemKind, TextDocumentPositionParams, ErrorMessageTracker
} from 'vscode-languageserver';

import * as crypto from 'crypto';
import * as childProcess from 'child_process';
import { createPipe } from './nitra/NamedPipe';
import { Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as Msg from './nitra/NitraMessages';
import { Serialize } from './nitra/NitraSerialize';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

export type Unpacked<T> =
	T extends (infer U)[] ? U :
	T extends (...args: any[]) => infer U ? U :
	T extends Promise<infer U> ? U :
	T;

let pipe: Unpacked<ReturnType<typeof createPipe>>;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;


	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;
	hasWorkspaceFolderCapability = capabilities.workspace && !!capabilities.workspace.workspaceFolders;
	hasDiagnosticRelatedInformationCapability = capabilities.textDocument && capabilities.textDocument.publishDiagnostics && capabilities.textDocument.publishDiagnostics.relatedInformation;

	let key = crypto.randomBytes(16).toString('hex');
	let name = `aaa-${key}`;
	let cp = childProcess.spawn(`c:/work/nitra/bin/Debug/Stage1/Nitra.ClientServer.Server.exe`, [name], { shell: true, detached: false });
	cp.on('close', (code, signal) => {
		console.log(`closed ${code}, ${signal}`);
	});
	console.log(cp.pid, "spawned");

	let subj = new Subject<string | Buffer>();
	cp.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		subj.next(data);
	})

	subj.pipe(filter((val) => val.toString().indexOf("Attempting to connect to pipes..." ) != -1)
			, take(1))
		.subscribe(async x => {
			console.log('create pipes');
			//await timer(3000).toPromise();

			pipe = await createPipe(name);

			let cv = <Msg.CheckVersion_ClientMessage>{ MsgId: 42, assemblyVersionGuid: "76cd9b8c-5706-4ee3-ba38-0f47129322b1" };
			pipe.syncRequest.next(Serialize(cv));

			let solution = <Msg.SolutionStartLoading_ClientMessage>{ id: { Value: 1 }, fullPath: 'D:\\work\\nitratest\\New suite\\test-0000' };
			pipe.syncRequest.next(Serialize(solution));

			let project = <Msg.ProjectStartLoading_ClientMessage>{
				id: { Value: 2 }
				, fullPath: "D:\\work\\nitratest\\New suite\\test-0000\\test-0000"
				, config: {
					ProjectSupport: {
						Caption: ""
						, TypeFullName: ""
						, Path: "D:\\work\\nitratest\\New suite"
					}
					, Languages: [{
						Name: "AkkaExpressionLang"
						, Path: "C:\\work\\olimpic\\akka-poc\\Sample.Grammar\\bin\\Debug\\akka_rule_parser.dll"
						, DynamicExtensions: []
					}]
					, References: []
				}
			};
			pipe.syncRequest.next(Serialize(project));
		});

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			}
		}
	}
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(change.settings.languageServerExample || defaultSettings);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({ scopeUri: resource, section: 'languageServerExample' });
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles((_change) => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});


// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	// The pass parameter contains the position of the text document in
	// which code complete got requested. For the example we ignore this
	// info and always provide the same completion items.
	return [
		{
			label: 'TypeScript',
			kind: CompletionItemKind.Text,
			data: 1
		},
		{
			label: 'JavaScript',
			kind: CompletionItemKind.Text,
			data: 2
		}
	]
});

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 1) {
		item.detail = 'TypeScript details',
			item.documentation = 'TypeScript documentation'
	} else if (item.data === 2) {
		item.detail = 'JavaScript details',
			item.documentation = 'JavaScript documentation'
	}
	return item;
});

connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});

/*
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();