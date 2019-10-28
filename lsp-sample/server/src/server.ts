<<<<<<< HEAD
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	DocumentHighlight,
	TextDocumentPositionParams,
	DocumentHighlightKind,
	ColorPresentation,
	ColorInformation,
	DocumentColorParams,
	NotificationType0,
	DidChangeTextDocumentParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver';

import * as crypto from 'crypto';
import * as childProcess from 'child_process';
import { createPipe } from './nitra/NamedPipe';
import { Subject, timer } from 'rxjs';
import { take, filter, delay } from 'rxjs/operators';
import * as Msg from './nitra/NitraMessages';
import { Serialize } from './nitra/NitraSerialize';
import { debug, log, print } from 'util';
import { StringManager } from './utils/StringManager';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);
//let connection = createConnection(process.stdin, process.stdout);

// console.log = connection.console.log.bind(connection.console);
// console.error = connection.console.error.bind(connection.console);

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

let completionSubject: Subject<CompletionItem[]>;
let GlobalStringIdMap = new StringManager();

connection.onShutdown(() => {
	let a = 0;
});

let projectPath = `C:\\work\\tdltest\\New suite\\test-0000\\test-0000`.toLowerCase();
let solutionPath = `C:\\work\\tdltest\\New suite\\test-0000`.toLowerCase();
let filePath = 'C:\\work\\tdltest\\New suite\\test-0000\\test-0000\\test-0000.test'.toLowerCase();

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

connection.onInitialize(async (params: InitializeParams) : Promise<InitializeResult> => {
	let capabilities = params.capabilities;



	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
	hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation);

	

	//await delay(5000);
	process.stdout.write("begin"); process.stdout.write('\r\n');


	//let key = crypto.randomBytes(16).toString('hex');
	//let name = `aaa-${key}`;
	let name = `aaa`;
	// let cp = childProcess.spawn(`c:/work/nitra/bin/Debug/Stage1/Nitra.ClientServer.Server.exe`, [name],
	// 				 { shell: true, detached: false });

	// let nitraServerStartedSubject = new Subject<string>();
	// let cp = childProcess.exec(`start c:/work/nitra/bin/Debug/Stage1/Nitra.ClientServer.Server.exe aaa`
	// 							, function callback(error, stdout, stderr) {
	// 								let a = 0;
	// 							});
	// cp.on('message', (message, handle) => {
	// 	nitraServerStartedSubject.next(message);
	// });

	//let serverStartedPromise = nitraServerStartedSubject.pipe(filter((a,b) => a === 'Attempting to connect to pipes...'), take(1)).toPromise();
	//await delay(20000);
	//let started = await serverStartedPromise;
	// cp.on('close', (code, signal) => {
	// 	process.stdout.write(`closed ${code}, ${signal}`);
	// });
	// //console.log(cp.pid, "spawned");


	//let subj = new Subject<string | Buffer>();
	// cp.stdout.on('data', (data) => {
	// 	//console.log(`stdout: ${data}`); 
	// 	process.stdout.write(`${data}`);

	// 	subj.next(data);
	// })

	pipe = await createPipe(name); 
	pipe.asyncResponse.subscribe(x => {
		process.stdout.write(JSON.stringify(x));
		process.stdout.write('\r\n');

		switch(x.MsgId) {
			case 93: {

				break;
			}
			case 109:
				{
					let list = x.completionList.map(a => {
						switch(a.MsgId) {
							case 132: return <CompletionItem>{label: a.text, kind: CompletionItemKind.Keyword, detail: a.description};
							case 133: return <CompletionItem>{label: a.name, kind: CompletionItemKind.Property, detail: a.description};
						}
					});
					completionSubject.next(list);
					break;
				}
		}
	});

	pipe.syncResponse.subscribe( x=> {
		process.stdout.write(JSON.stringify(x));
		process.stdout.write('\r\n');
	});

	// subj.pipe(filter((val) => val.toString().indexOf("Attempting to connect to pipes..." ) != -1)
	// 		, take(1))
	// 	.subscribe(async x => {
	process.stdout.write('create pipes\r\n');
	//await timer(5000).toPromise();



	let cv = <Msg.CheckVersion_ClientMessage>{ MsgId: 42, assemblyVersionGuid: "45b8bf7d-4b94-41cc-8265-a35fdf88eb06" };
	pipe.syncRequest.next(Serialize(cv));

	let solution = <Msg.SolutionStartLoading_ClientMessage>{ MsgId: 43, id: { Value: GlobalStringIdMap.get(solutionPath) }, fullPath: solutionPath };
	pipe.syncRequest.next(Serialize(solution));


	let project = <Msg.ProjectStartLoading_ClientMessage>{
		MsgId: 46,
		id: { Value: GlobalStringIdMap.get(projectPath) }
		, fullPath: projectPath
		, config: {
			MsgId: 127
			, ProjectSupport: { MsgId: 126, Caption: "TdlLang", TypeFullName: "Tdl.ProjectSupport", Path: `C:\\work\\Nitra-TDL\\bin\\Debug\\Tdl.dll` }
			, Languages: [{ MsgId: 129, Name: "TdlLang", Path: `C:\\work\\Nitra-TDL\\bin\\Debug\\tdl.dll`, DynamicExtensions: [] }]
			, References: ["FullName:mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
				, "FullName:System, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
				, "FullName:System.Core, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"]
		}
	};
	pipe.syncRequest.next(Serialize(project));

	project.config.References.forEach(x => {
		var refMsg = <Msg.ReferenceLoaded_ClientMessage>{
			MsgId: 52
			, projectId: { Value: 2 }
			, name: x
		};
		pipe.syncRequest.next(Serialize(refMsg));
	});

	var fileMsg = <Msg.FileLoaded_ClientMessage>{
		MsgId: 55
		, fullPath: filePath
		, id: { Value: GlobalStringIdMap.get(filePath) }
		, version: { Value: 0 }
		, projectId: { Value: GlobalStringIdMap.get(projectPath) }
		, contentOpt: ""
		, hasContent: false
	};
	pipe.syncRequest.next(Serialize(fileMsg));

	var projectLoadedMsg = <Msg.ProjectLoaded_ClientMessage>{ MsgId: 47, id: { Value: GlobalStringIdMap.get(projectPath) } };
	pipe.syncRequest.next(Serialize(projectLoadedMsg));

	var solutionLoadedMsg = <Msg.SolutionLoaded_ClientMessage>{ MsgId: 44, id: { Value:  GlobalStringIdMap.get(solutionPath) } };
	pipe.syncRequest.next(Serialize(solutionLoadedMsg));

	var fileActivatedMsg = <Msg.FileActivated_ClientMessage>{ MsgId: 60, id: { Value: GlobalStringIdMap.get(filePath) }
																		, projectId: { Value: GlobalStringIdMap.get(projectPath) }
																		, version: { Value: 0 } };
	pipe.syncRequest.next(Serialize(fileActivatedMsg));


	// });

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental
			// Tell the client that the server supports code completion
			, completionProvider: { resolveProvider: true }
			//, colorProvider: true


		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined
		);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});



connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.

documents.onDidChangeContent(change => {

	validateTextDocument(change.document);
});

connection.onDidChangeTextDocument((params) => {
	let docs = documents;	
	let lp = filePath;
	let uri = decodeURIComponent(params.textDocument.uri).toLowerCase().replace('file:///', '').split('/').join('\\');
	let fileId = GlobalStringIdMap.get(uri);

	let changes = params.contentChanges.map((change, index) => {
		if(change.text === '' && change.rangeLength > 0) {
			
			return <Msg.Delete_FileChange>{MsgId:117, span: {MsgId:114, StartPos:0, EndPos: 0 }};
		}
	});
	let msg = <Msg.FileChanged_ClientMessage>{MsgId:62, id :{ Value: fileId}, version: {Value: params.textDocument.version}, };
});

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			(item.detail = 'TypeScript details'),
				(item.documentation = 'TypeScript documentation');
		} else if (item.data === 2) {
			(item.detail = 'JavaScript details'),
				(item.documentation = 'JavaScript documentation');
		}
		return item;
	}
);

connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	//connection.console.log(`${params.textDocument.uri} opened.`);
	process.stdout.write(`${params.textDocument.uri} opened.\r\n`);
	

});

connection.onDidCloseTextDocument((params) => {
    // A text document got closed in VS Code.
    // params.uri uniquely identifies the document.
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

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnostic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// This handler provides the initial list of the completion items.
connection.onCompletion(async (_textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[]> => {

		var completeWordMsg = <Msg.CompleteWord_ClientMessage>{
			MsgId:65,
			id: {Value: 3},
			projectId: {Value:2},
			version: {Value: 0},
			pos: _textDocumentPosition.position.character
		};

		completionSubject = new Subject<CompletionItem[]>();
		//completionSubject.subscribe(x => {});

		let promise = completionSubject.pipe(take(1)).toPromise();
		
		pipe.syncRequest.next(Serialize(completeWordMsg));
		let retval = await promise;
		return retval;
	}
);

// Listen on the connection
connection.listen();

// connection.onColorPresentation((params) : ColorPresentation[] => {
// 	return [{}]
// });

// connection.onDocumentColor((params: DocumentColorParams) : ColorInformation[] =>  {
// 	return [{color: {red:255, blue:0, green: 0, alpha: 1}, range: {start:{line:0, character:0}, end :{line:0, character: 10}}}]
// });

// connection.onDocumentHighlight((_textDocumentPositionParams: TextDocumentPositionParams) : DocumentHighlight[] => {
// 	return [<DocumentHighlight>{kind: DocumentHighlightKind.Text, range: {start: {character: 0, line:0}, end: {line:1, character:2}}}];
// });

// connection.onDocumentHighlight((_textDocumentPositionParams: TextDocumentPositionParams) : DocumentHighlight[] => {
// 	return [{}];
// });

// 100 - 100*0.05=95
// 100* (1 - 0.05)
// 0.35 * 1.05=0.3675
// 95 * 0.35=33.25
// 100 - 36.75=63.
// 95 - 33.25=61.7525
// 100 - 100 * 0.95 * 0.35=66.75

// 1 - (0.95 - 0.95*0.5)=0.525
// 1 - 0.6175=0.3825
// 0.3825 / 0.35=1.092857
// 0.35 / 0.3825=0.915033

// 200 - 200*0.05=190
// 123.5
// 
=======
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
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
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
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
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
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
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnostic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
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
		];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.detail = 'TypeScript details';
			item.documentation = 'TypeScript documentation';
		} else if (item.data === 2) {
			item.detail = 'JavaScript details';
			item.documentation = 'JavaScript documentation';
		}
		return item;
	}
);

/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.textDocument.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.textDocument.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
>>>>>>> master
