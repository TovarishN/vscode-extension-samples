import {Message} from './NitraMessages';
import {SerializeString, SerializeType, SerializeMessage, SerializeInt32, SerializeArr
    , SerializeBoolean, SerializeInt16, SerializeInt64, SerializeUInt32
    , SerializeUInt16, SerializeByte, SerializeFloat, SerializeChar, SerializeDouble} from './serializers';

export function Serialize(msg: Message): Buffer {
    switch (msg.MsgId) {
case 42: { // CheckVersion_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeString(msg.assemblyVersionGuid)]);
}
case 43: { // SolutionStartLoading_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)
,SerializeString(msg.fullPath)]);
}
case 44: { // SolutionLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)]);
}
case 45: { // SolutionUnloaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)]);
}
case 46: { // ProjectStartLoading_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)
,SerializeString(msg.fullPath)
,SerializeMessage(msg.config.MsgId
, [SerializeMessage(msg.config.ProjectSupport.MsgId
, [SerializeString(msg.config.ProjectSupport.Caption)
,SerializeString(msg.config.ProjectSupport.TypeFullName)
,SerializeString(msg.config.ProjectSupport.Path)])
,SerializeArr(msg.config.Languages.map(item => SerializeType([SerializeString(item.Name)
,SerializeString(item.Path)
,SerializeArr(item.DynamicExtensions.map(item => SerializeType([SerializeString(item.Name)
,SerializeString(item.Path)])))])))
,SerializeArr(msg.config.References.map(item => SerializeString(item)))])]);
}
case 47: { // ProjectLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)]);
}
case 48: { // ProjectUnloaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)]);
}
case 49: { // ProjectRename_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.oldId.Value)
,SerializeInt32(msg.newId.Value)
,SerializeString(msg.newPath)]);
}
case 50: { // ProjectReferenceLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.referencedProjectId.Value)
,SerializeString(msg.path)]);
}
case 51: { // ProjectReferenceUnloaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.referencedProjectId.Value)
,SerializeString(msg.path)]);
}
case 52: { // ReferenceLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeString(msg.name)]);
}
case 53: { // ReferenceUnloaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeString(msg.name)]);
}
case 54: { // FileSaved_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)]);
}
case 55: { // FileLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeString(msg.fullPath)
,SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)
,SerializeBoolean(msg.hasContent)
,SerializeString(msg.contentOpt)]);
}
case 56: { // FileReparse_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)]);
}
case 57: { // FileUnloaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)]);
}
case 58: { // FileRenamed_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.oldId.Value)
,SerializeInt32(msg.newId.Value)
,SerializeString(msg.newPath)]);
}
case 59: { // FileInMemoryLoaded_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)
,SerializeString(msg.name)
,SerializeString(msg.content)]);
}
case 60: { // FileActivated_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)]);
}
case 61: { // FileDeactivated_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)]);
}
case 62: { // FileChanged_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)
,Serialize(msg.change)
,SerializeType([SerializeInt32(msg.caretPos.Pos)
,SerializeInt32(msg.caretPos.Version.Value)])]);
}
case 63: { // FileChangedBatch_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)
,SerializeArr(msg.changes.map(item => Serialize(item)))
,SerializeType([SerializeInt32(msg.caretPos.Pos)
,SerializeInt32(msg.caretPos.Version.Value)])]);
}
case 64: { // PrettyPrint_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(<number>msg.state)]);
}
case 65: { // CompleteWord_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)
,SerializeInt32(msg.version.Value)
,SerializeInt32(msg.pos)]);
}
case 66: { // CompleteWordDismiss_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.id.Value)]);
}
case 67: { // FindSymbolReferences_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeType([SerializeInt32(msg.pos.Pos)
,SerializeInt32(msg.pos.Version.Value)])]);
}
case 68: { // FindSymbolDefinitions_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeType([SerializeInt32(msg.pos.Pos)
,SerializeInt32(msg.pos.Version.Value)])]);
}
case 69: { // ParseTreeReflection_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeBoolean(msg.enable)]);
}
case 70: { // GetObjectContent_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeInt32(msg.fileVersion.Value)
,SerializeInt32(msg.objectId)]);
}
case 71: { // GetObjectGraph_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeInt32(msg.fileVersion.Value)
,SerializeInt32(msg.objectId)]);
}
case 72: { // AttachDebugger_ClientMessage
return SerializeMessage(msg.MsgId
, []);
}
case 73: { // GetLibsMetadata_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.libs.map(item => SerializeString(item)))]);
}
case 74: { // GetLibsSyntaxModules_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.libs.map(item => SerializeString(item)))]);
}
case 75: { // GetLibsProjectSupports_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.libs.map(item => SerializeString(item)))]);
}
case 76: { // GetFileExtensions_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.languageNames.map(item => SerializeString(item)))]);
}
case 77: { // SetCaretPos_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeType([SerializeInt32(msg.pos.Pos)
,SerializeInt32(msg.pos.Version.Value)])]);
}
case 78: { // GetHint_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.fileId.Value)
,SerializeType([SerializeInt32(msg.pos.Pos)
,SerializeInt32(msg.pos.Version.Value)])]);
}
case 79: { // GetSubHint_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.projectId.Value)
,SerializeInt32(msg.symbolId)]);
}
case 80: { // FindDeclarations_ClientMessage
return SerializeMessage(msg.MsgId
, [SerializeString(msg.pattern)
,SerializeInt32(msg.primaryProjectId.Value)
,SerializeBoolean(msg.hideExternalItems)
,SerializeArr(msg.kinds.map(item => SerializeString(item)))]);
}
case 81: { // Shutdown_ClientMessage
return SerializeMessage(msg.MsgId
, []);
}
case 82: { // FindSymbolDefinitions_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeType([SerializeInt32(msg.referenceSpan.StartPos)
,SerializeInt32(msg.referenceSpan.EndPos)])
,SerializeArr(msg.definitions.map(item => Serialize(item)))]);
}
case 83: { // FindSymbolReferences_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeType([SerializeInt32(msg.referenceSpan.StartPos)
,SerializeInt32(msg.referenceSpan.EndPos)])
,SerializeArr(msg.symbols.map(item => Serialize(item)))]);
}
case 84: { // ParseTreeReflection_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeArr(msg.root.map(item => Serialize(item)))]);
}
case 85: { // ObjectContent_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,Serialize(msg.content)]);
}
case 86: { // LibsMetadata_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeArr(msg.metadatas.map(item => Serialize(item)))]);
}
case 87: { // LibsSyntaxModules_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeArr(msg.modules.map(item => Serialize(item)))]);
}
case 88: { // LibsProjectSupports_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeArr(msg.libs.map(item => Serialize(item)))]);
}
case 89: { // FileExtensions_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.solutionId.Value)
,SerializeArr(msg.fileExtensions.map(item => SerializeString(item)))]);
}
case 90: { // SubHint_ServerMessage
return SerializeMessage(msg.MsgId
, [SerializeString(msg.text)]);
}
case 91: { // LanguageLoaded_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeArr(msg.spanClassInfos.map(item => Serialize(item)))]);
}
case 92: { // OutliningCreated_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.outlining.map(item => Serialize(item)))]);
}
case 93: { // KeywordsHighlightingCreated_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.spanInfos.map(item => Serialize(item)))]);
}
case 94: { // MatchedBrackets_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.results.map(item => Serialize(item)))]);
}
case 95: { // SymbolsHighlightingCreated_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.spanInfos.map(item => Serialize(item)))]);
}
case 96: { // ProjectLoadingMessages_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.messages.map(item => SerializeType([SerializeInt32(<number>item.Type)
,SerializeType([SerializeType([SerializeInt32(item.Location.File.FileId.Value)
,SerializeInt32(item.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(item.Location.Range.Span.StartPos)
,SerializeInt32(item.Location.Range.Span.EndPos)])
,SerializeInt32(item.Location.Range.StartLine)
,SerializeInt32(item.Location.Range.StartColumn)
,SerializeInt32(item.Location.Range.EndLine)
,SerializeInt32(item.Location.Range.EndColumn)
,SerializeString(item.Location.Range.Text)])])
,SerializeString(item.Text)
,SerializeInt32(item.Number)
,SerializeInt32(<number>item.Source)
,SerializeArr(item.NestedMessages.map(item => Serialize(item)))])))]);
}
case 97: { // ParsingMessages_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.messages.map(item => SerializeType([SerializeInt32(<number>item.Type)
,SerializeType([SerializeType([SerializeInt32(item.Location.File.FileId.Value)
,SerializeInt32(item.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(item.Location.Range.Span.StartPos)
,SerializeInt32(item.Location.Range.Span.EndPos)])
,SerializeInt32(item.Location.Range.StartLine)
,SerializeInt32(item.Location.Range.StartColumn)
,SerializeInt32(item.Location.Range.EndLine)
,SerializeInt32(item.Location.Range.EndColumn)
,SerializeString(item.Location.Range.Text)])])
,SerializeString(item.Text)
,SerializeInt32(item.Number)
,SerializeInt32(<number>item.Source)
,SerializeArr(item.NestedMessages.map(item => Serialize(item)))])))]);
}
case 98: { // MappingMessages_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.messages.map(item => SerializeType([SerializeInt32(<number>item.Type)
,SerializeType([SerializeType([SerializeInt32(item.Location.File.FileId.Value)
,SerializeInt32(item.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(item.Location.Range.Span.StartPos)
,SerializeInt32(item.Location.Range.Span.EndPos)])
,SerializeInt32(item.Location.Range.StartLine)
,SerializeInt32(item.Location.Range.StartColumn)
,SerializeInt32(item.Location.Range.EndLine)
,SerializeInt32(item.Location.Range.EndColumn)
,SerializeString(item.Location.Range.Text)])])
,SerializeString(item.Text)
,SerializeInt32(item.Number)
,SerializeInt32(<number>item.Source)
,SerializeArr(item.NestedMessages.map(item => Serialize(item)))])))]);
}
case 99: { // SemanticAnalysisMessages_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.messages.map(item => SerializeType([SerializeInt32(<number>item.Type)
,SerializeType([SerializeType([SerializeInt32(item.Location.File.FileId.Value)
,SerializeInt32(item.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(item.Location.Range.Span.StartPos)
,SerializeInt32(item.Location.Range.Span.EndPos)])
,SerializeInt32(item.Location.Range.StartLine)
,SerializeInt32(item.Location.Range.StartColumn)
,SerializeInt32(item.Location.Range.EndLine)
,SerializeInt32(item.Location.Range.EndColumn)
,SerializeString(item.Location.Range.Text)])])
,SerializeString(item.Text)
,SerializeInt32(item.Number)
,SerializeInt32(<number>item.Source)
,SerializeArr(item.NestedMessages.map(item => Serialize(item)))])))]);
}
case 100: { // SemanticAnalysisDone_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)]);
}
case 101: { // PrettyPrintCreated_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(<number>msg.type)
,SerializeString(msg.text)]);
}
case 102: { // ReflectionStructCreated_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeMessage(msg.root.MsgId
, [SerializeMessage(msg.root.info.MsgId
, [SerializeString(msg.root.info.ShortName)
,SerializeString(msg.root.info.FullName)
,SerializeBoolean(msg.root.info.IsMarker)
,SerializeBoolean(msg.root.info.CanParseEmptyString)])
,SerializeString(msg.root.description)
,SerializeInt32(<number>msg.root.kind)
,SerializeType([SerializeInt32(msg.root.span.StartPos)
,SerializeInt32(msg.root.span.EndPos)])
,SerializeArr(msg.root.children.map(item => Serialize(item)))])]);
}
case 103: { // RefreshReferencesFailed_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeString(msg.exception)]);
}
case 104: { // RefreshProjectFailed_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeString(msg.exception)]);
}
case 105: { // FindSymbolReferences_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeType([SerializeInt32(msg.referenceSpan.StartPos)
,SerializeInt32(msg.referenceSpan.EndPos)])
,SerializeArr(msg.symbols.map(item => Serialize(item)))]);
}
case 106: { // Hint_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeString(msg.text)
,SerializeType([SerializeInt32(msg.referenceSpan.StartPos)
,SerializeInt32(msg.referenceSpan.EndPos)])]);
}
case 107: { // Exception_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeString(msg.exception)]);
}
case 108: { // FoundDeclarations_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeInt32(msg.projectId.Value)
,SerializeArr(msg.declarations.map(item => Serialize(item)))]);
}
case 109: { // CompleteWord_AsyncServerMessage
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.Version.Value)
,SerializeInt32(msg.SolutionId.Value)
,SerializeType([SerializeInt32(msg.replacementSpan.StartPos)
,SerializeInt32(msg.replacementSpan.EndPos)])
,SerializeArr(msg.completionList.map(item => Serialize(item)))]);
}
case 110: { // ProjectSupports
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.ProjectSupports.map(item => Serialize(item)))]);
}
case 111: { // SyntaxModules
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.Modules.map(item => SerializeString(item)))]);
}
case 112: { // LibMetadata
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.ProjectSupprts.map(item => SerializeString(item)))
,SerializeArr(msg.Languages.map(item => Serialize(item)))]);
}
case 113: { // SymbolRreferences
return SerializeType([SerializeInt32(msg.SymbolId)
,SerializeArr(msg.Definitions.map(item => Serialize(item)))
,SerializeArr(msg.References.map(item => Serialize(item)))]);
}
case 114: { // NSpan
return SerializeType([SerializeInt32(msg.StartPos)
,SerializeInt32(msg.EndPos)]);
}
case 115: { // SpanInfo
return SerializeType([SerializeType([SerializeInt32(msg.Span.StartPos)
,SerializeInt32(msg.Span.EndPos)])
,SerializeInt32(msg.SpanClassId)]);
}
case 116: { // Insert_FileChange
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.pos)
,SerializeString(msg.text)]);
}
case 117: { // Delete_FileChange
return SerializeMessage(msg.MsgId
, [SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])]);
}
case 118: { // Replace_FileChange
return SerializeMessage(msg.MsgId
, [SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])
,SerializeString(msg.text)]);
}
case 119: { // FileIdentity
return SerializeType([SerializeInt32(msg.FileId.Value)
,SerializeInt32(msg.FileVersion.Value)]);
}
case 120: { // FileEntries
return SerializeType([SerializeType([SerializeInt32(msg.File.FileId.Value)
,SerializeInt32(msg.File.FileVersion.Value)])
,SerializeArr(msg.Ranges.map(item => Serialize(item)))]);
}
case 123: { // Range
return SerializeType([SerializeType([SerializeInt32(msg.Span.StartPos)
,SerializeInt32(msg.Span.EndPos)])
,SerializeInt32(msg.StartLine)
,SerializeInt32(msg.StartColumn)
,SerializeInt32(msg.EndLine)
,SerializeInt32(msg.EndColumn)
,SerializeString(msg.Text)]);
}
case 124: { // Location
return SerializeType([SerializeType([SerializeInt32(msg.File.FileId.Value)
,SerializeInt32(msg.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(msg.Range.Span.StartPos)
,SerializeInt32(msg.Range.Span.EndPos)])
,SerializeInt32(msg.Range.StartLine)
,SerializeInt32(msg.Range.StartColumn)
,SerializeInt32(msg.Range.EndLine)
,SerializeInt32(msg.Range.EndColumn)
,SerializeString(msg.Range.Text)])]);
}
case 121: { // DeclarationInfo
return SerializeType([SerializeInt32(msg.SymbolId)
,SerializeString(msg.Name)
,SerializeArr(msg.NameMatchRuns.map(item => Serialize(item)))
,SerializeString(msg.FullName)
,SerializeString(msg.Kind)
,SerializeInt32(msg.SpanClassId)
,SerializeType([SerializeType([SerializeInt32(msg.Location.File.FileId.Value)
,SerializeInt32(msg.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(msg.Location.Range.Span.StartPos)
,SerializeInt32(msg.Location.Range.Span.EndPos)])
,SerializeInt32(msg.Location.Range.StartLine)
,SerializeInt32(msg.Location.Range.StartColumn)
,SerializeInt32(msg.Location.Range.EndLine)
,SerializeInt32(msg.Location.Range.EndColumn)
,SerializeString(msg.Location.Range.Text)])])]);
}
case 122: { // SymbolLocation
return SerializeType([SerializeInt32(msg.SymbolId)
,SerializeType([SerializeType([SerializeInt32(msg.Location.File.FileId.Value)
,SerializeInt32(msg.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(msg.Location.Range.Span.StartPos)
,SerializeInt32(msg.Location.Range.Span.EndPos)])
,SerializeInt32(msg.Location.Range.StartLine)
,SerializeInt32(msg.Location.Range.StartColumn)
,SerializeInt32(msg.Location.Range.EndLine)
,SerializeInt32(msg.Location.Range.EndColumn)
,SerializeString(msg.Location.Range.Text)])])]);
}
case 125: { // CompilerMessage
return SerializeType([SerializeInt32(<number>msg.Type)
,SerializeType([SerializeType([SerializeInt32(msg.Location.File.FileId.Value)
,SerializeInt32(msg.Location.File.FileVersion.Value)])
,SerializeType([SerializeType([SerializeInt32(msg.Location.Range.Span.StartPos)
,SerializeInt32(msg.Location.Range.Span.EndPos)])
,SerializeInt32(msg.Location.Range.StartLine)
,SerializeInt32(msg.Location.Range.StartColumn)
,SerializeInt32(msg.Location.Range.EndLine)
,SerializeInt32(msg.Location.Range.EndColumn)
,SerializeString(msg.Location.Range.Text)])])
,SerializeString(msg.Text)
,SerializeInt32(msg.Number)
,SerializeInt32(<number>msg.Source)
,SerializeArr(msg.NestedMessages.map(item => Serialize(item)))]);
}
case 126: { // ProjectSupport
return SerializeMessage(msg.MsgId
, [SerializeString(msg.Caption)
,SerializeString(msg.TypeFullName)
,SerializeString(msg.Path)]);
}
case 127: { // Config
return SerializeMessage(msg.MsgId
, [SerializeMessage(msg.ProjectSupport.MsgId
, [SerializeString(msg.ProjectSupport.Caption)
,SerializeString(msg.ProjectSupport.TypeFullName)
,SerializeString(msg.ProjectSupport.Path)])
,SerializeArr(msg.Languages.map(item => SerializeType([SerializeString(item.Name)
,SerializeString(item.Path)
,SerializeArr(item.DynamicExtensions.map(item => SerializeType([SerializeString(item.Name)
,SerializeString(item.Path)])))])))
,SerializeArr(msg.References.map(item => SerializeString(item)))]);
}
case 128: { // DynamicExtensionInfo
return SerializeType([SerializeString(msg.Name)
,SerializeString(msg.Path)]);
}
case 129: { // LanguageInfo
return SerializeType([SerializeString(msg.Name)
,SerializeString(msg.Path)
,SerializeArr(msg.DynamicExtensions.map(item => SerializeType([SerializeString(item.Name)
,SerializeString(item.Path)])))]);
}
case 130: { // SpanClassInfo
return SerializeType([SerializeString(msg.FullName)
,SerializeInt32(msg.Id)
,SerializeInt32(msg.ForegroundColor)]);
}
case 131: { // OutliningInfo
return SerializeType([SerializeType([SerializeInt32(msg.Span.StartPos)
,SerializeInt32(msg.Span.EndPos)])
,SerializeBoolean(msg.IsDefaultCollapsed)
,SerializeBoolean(msg.IsImplementation)]);
}
case 132: { // Literal_CompletionElem
return SerializeMessage(msg.MsgId
, [SerializeString(msg.text)
,SerializeString(msg.description)]);
}
case 133: { // Symbol_CompletionElem
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.Id)
,SerializeString(msg.name)
,SerializeString(msg.content)
,SerializeString(msg.description)
,SerializeInt32(msg.iconId)]);
}
case 134: { // ReflectionInfo
return SerializeMessage(msg.MsgId
, [SerializeString(msg.ShortName)
,SerializeString(msg.FullName)
,SerializeBoolean(msg.IsMarker)
,SerializeBoolean(msg.CanParseEmptyString)]);
}
case 135: { // ParseTreeReflectionStruct
return SerializeMessage(msg.MsgId
, [SerializeMessage(msg.info.MsgId
, [SerializeString(msg.info.ShortName)
,SerializeString(msg.info.FullName)
,SerializeBoolean(msg.info.IsMarker)
,SerializeBoolean(msg.info.CanParseEmptyString)])
,SerializeString(msg.description)
,SerializeInt32(<number>msg.kind)
,SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])
,SerializeArr(msg.children.map(item => Serialize(item)))]);
}
case 136: { // GrammarDescriptor
return SerializeMessage(msg.MsgId
, [SerializeString(msg.FullName)
,SerializeString(msg.AssemblyLocation)]);
}
case 137: { // LibReference
return SerializeMessage(msg.MsgId
, [SerializeString(msg.Name)]);
}
case 138: { // Fail_ContentDescriptor
return SerializeMessage(msg.MsgId
, [SerializeString(msg.msg)]);
}
case 139: { // Members_ContentDescriptor
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))]);
}
case 140: { // Items_ContentDescriptor
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.items.map(item => Serialize(item)))]);
}
case 141: { // AstItems_ContentDescriptor
return SerializeMessage(msg.MsgId
, [SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))
,SerializeArr(msg.items.map(item => Serialize(item)))]);
}
case 142: { // Unknown_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeString(msg.str)]);
}
case 143: { // Null_ObjectDescriptor
return SerializeMessage(msg.MsgId
, []);
}
case 144: { // NotEvaluated_ObjectDescriptor
return SerializeMessage(msg.MsgId
, []);
}
case 145: { // Ast_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])
,SerializeInt32(msg.id)
,SerializeString(msg.str)
,SerializeString(msg.typeName)
,SerializeString(msg.typeFullName)
,SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))]);
}
case 146: { // Symbol_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id)
,SerializeString(msg.name)
,SerializeString(msg.fullName)
,SerializeString(msg.typeName)
,SerializeString(msg.typeFullName)
,SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))]);
}
case 147: { // Object_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id)
,SerializeString(msg.str)
,SerializeString(msg.typeName)
,SerializeString(msg.typeFullName)
,SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))]);
}
case 148: { // AstList_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])
,SerializeInt32(msg.id)
,SerializeArr(msg.items.map(item => Serialize(item)))
,SerializeArr(msg.members.map(item => SerializeMessage(item.MsgId
, [SerializeInt32(<number>item.Kind)
,SerializeString(item.Name)
,Serialize(item.Object)])))
,SerializeInt32(msg.count)]);
}
case 149: { // Seq_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.id)
,SerializeArr(msg.items.map(item => Serialize(item)))
,SerializeInt32(msg.count)]);
}
case 150: { // String_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeString(msg.value)]);
}
case 151: { // Int16_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt16(msg.value)]);
}
case 152: { // Int32_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt32(msg.value)]);
}
case 153: { // Int64_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt64(msg.value)]);
}
case 154: { // Char_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeChar(msg.value)]);
}
case 155: { // SByte_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeByte(msg.value)]);
}
case 156: { // UInt16_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeUInt16(msg.value)]);
}
case 157: { // UInt32_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeUInt32(msg.value)]);
}
case 158: { // UInt64_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt64(msg.value)]);
}
case 159: { // Byte_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeByte(msg.value)]);
}
case 160: { // Single_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeFloat(msg.value)]);
}
case 161: { // Double_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeDouble(msg.value)]);
}
case 162: { // Boolean_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeBoolean(msg.value)]);
}
case 163: { // Parsed_ObjectDescriptor
return SerializeMessage(msg.MsgId
, [SerializeType([SerializeInt32(msg.span.StartPos)
,SerializeInt32(msg.span.EndPos)])
,Serialize(msg.value)]);
}
case 164: { // PropertyDescriptor
return SerializeMessage(msg.MsgId
, [SerializeInt32(<number>msg.Kind)
,SerializeString(msg.Name)
,Serialize(msg.Object)]);
}
case 165: { // MatchBrackets
return SerializeType([SerializeType([SerializeInt32(msg.Open.StartPos)
,SerializeInt32(msg.Open.EndPos)])
,SerializeType([SerializeInt32(msg.Close.StartPos)
,SerializeInt32(msg.Close.EndPos)])]);
}
case 166: { // VersionedPos
return SerializeType([SerializeInt32(msg.Pos)
,SerializeInt32(msg.Version.Value)]);
}
default: return Buffer.alloc(0);
}
}
