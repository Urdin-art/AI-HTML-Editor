
import React from 'react';
import { ChatMessage, GeminiModel, FileItem } from '../types';
import IframePreview from './IframePreview';
import ChatPanel from './ChatPanel';
import SavePanel from './SavePanel';
import LoadingSpinner from './LoadingSpinner';
import ModelSelector from './ModelSelector';
import FileManager from './FileManager';
import ChatInputAddons from './ChatInputAddons';

interface EditorScreenProps {
  htmlContent: string;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearMemory: () => void;
  onDeselectAll: () => void;
  onSave: (filename: string) => Promise<void>;
  isChatLoading: boolean;
  saveStep: 'idle' | 'cleaning' | 'optimizing';
  currentModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  onFileSelectionChange: (files: FileItem[]) => void;
  docCount: number;
  imgCount: number;
  fileManagerKey: number;
}

const EditorScreen: React.FC<EditorScreenProps> = ({
  htmlContent,
  chatMessages,
  onSendMessage,
  onClearMemory,
  onDeselectAll,
  onSave,
  isChatLoading,
  saveStep,
  currentModel,
  onModelChange,
  onFileSelectionChange,
  docCount,
  imgCount,
  fileManagerKey,
}) => {
  return (
    <div className="relative h-screen w-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-stone-light">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
        <div className="flex-grow">
            <IframePreview htmlContent={htmlContent} onDeselectAll={onDeselectAll} />
        </div>
        <SavePanel onSave={onSave} isLoading={saveStep !== 'idle'} />
      </div>
      <div className="col-span-1 flex flex-col h-full bg-white shadow-lg">
        <div className="p-4 border-b">
            <FileManager onSelectionChange={onFileSelectionChange} key={fileManagerKey} />
        </div>
        <ModelSelector currentModel={currentModel} onModelChange={onModelChange} />
        <div className="relative flex-grow">
            <ChatPanel
              messages={chatMessages}
              onSendMessage={onSendMessage}
              onClearMemory={onClearMemory}
              isLoading={isChatLoading}
            />
            <ChatInputAddons docCount={docCount} imgCount={imgCount} />
        </div>
      </div>
       {(isChatLoading || saveStep !== 'idle') && (
        <div className="absolute inset-0 bg-stone-dark bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-stone-light p-6 rounded-lg shadow-2xl flex items-center gap-4 border-2 border-clay-dark">
            <LoadingSpinner />
            <span className="text-lg font-semibold text-clay-dark">
              {isChatLoading && 'La IA está trabajando...'}
              {saveStep === 'cleaning' && 'Limpiando código...'}
              {saveStep === 'optimizing' && 'Optimizando imágenes y guardando...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorScreen;
