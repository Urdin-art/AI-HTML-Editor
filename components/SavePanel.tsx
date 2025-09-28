
import React, { useState } from 'react';

interface SavePanelProps {
  onSave: (filename: string) => Promise<void>;
  isLoading: boolean;
}

const SavePanel: React.FC<SavePanelProps> = ({ onSave, isLoading }) => {
  const [filename, setFilename] = useState('index.html');

  const handleSaveClick = () => {
    if (filename.trim()) {
      onSave(filename.trim());
    }
  };

  return (
    <div className="p-4 bg-white border-t-2 border-l border-stone-light shadow-inner flex items-center gap-4">
       <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="nombre-del-archivo.html"
        className="flex-grow p-3 border-2 border-clay rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-stone-light/50"
      />
      <button
        onClick={handleSaveClick}
        disabled={isLoading || !filename.trim()}
        className="bg-clay hover:bg-clay-dark text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-stone disabled:cursor-wait"
      >
        {isLoading ? 'Guardando...' : 'Guardar en Servidor'}
      </button>
    </div>
  );
};

export default SavePanel;
