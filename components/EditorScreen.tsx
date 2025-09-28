
import React from 'react';
import { ChatMessage, GeminiModel } from '../types';
import IframePreview from './IframePreview';
import ChatPanel from './ChatPanel';
import SavePanel from './SavePanel';
import LoadingSpinner from './LoadingSpinner';
import ModelSelector from './ModelSelector';

interface EditorScreenProps {
  htmlContent: string;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearMemory: () => void;
  onDeselectAll: () => void;
  onSave: (filename: string) => Promise<void>;
  isChatLoading: boolean;
  isSaving: boolean;
  currentModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
}

const EditorScreen: React.FC<EditorScreenProps> = ({
  htmlContent,
  chatMessages,
  onSendMessage,
  onClearMemory,
  onDeselectAll,
  onSave,
  isChatLoading,
  isSaving,
  currentModel,
  onModelChange,
}) => {
  return (
    <div className="relative h-screen w-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-stone-light">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
        <div className="flex-grow">
            <IframePreview htmlContent={htmlContent} onDeselectAll={onDeselectAll} />
        </div>
        <SavePanel onSave={onSave} isLoading={isSaving} />
      </div>
      <div className="col-span-1 flex flex-col h-full">
        <ModelSelector currentModel={currentModel} onModelChange={onModelChange} />
        <ChatPanel
          messages={chatMessages}
          onSendMessage={onSendMessage}
          onClearMemory={onClearMemory}
          isLoading={isChatLoading}
        />
      </div>
       {(isChatLoading || isSaving) && (
        <div className="absolute inset-0 bg-stone-dark bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-stone-light p-6 rounded-lg shadow-2xl flex items-center gap-4 border-2 border-clay-dark">
            <LoadingSpinner />
            <span className="text-lg font-semibold text-clay-dark">
              {isSaving ? 'Limpiando y preparando el código...' : 'La IA está trabajando...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorScreen;
