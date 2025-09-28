import React from 'react';
import { GeminiModel } from '../types';

interface ModelSelectorProps {
  currentModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onModelChange }) => {
  return (
    <div className="p-4 bg-white border-b border-l border-stone-light">
      <label htmlFor="model-selector" className="block text-sm font-bold text-clay-dark mb-2">
        Modelo de IA
      </label>
      <select
        id="model-selector"
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value as GeminiModel)}
        className="w-full p-2 border-2 border-clay rounded-md bg-stone-light text-clay-dark focus:ring-2 focus:ring-accent focus:border-accent"
      >
        <option value={GeminiModel.FLASH}>Gemini Flash (Rápido)</option>
        <option value={GeminiModel.PRO}>Gemini Pro (Avanzado)</option>
      </select>
    </div>
  );
};

export default ModelSelector;
