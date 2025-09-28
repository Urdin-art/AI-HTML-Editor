import React, { useState } from 'react';

interface ApiKeyScreenProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-stone-light text-stone-dark">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl border-2 border-clay-dark">
        <h1 className="text-3xl font-bold mb-4 text-center text-clay-dark">Gemini API Key</h1>
        <p className="mb-6 text-center text-stone-DEFAULT">
          Por favor, introduce tu clave de la API de Gemini para continuar. 
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Introduce tu API Key"
            className="w-full px-4 py-2 mb-4 border-2 border-clay rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
          />
          <button
            type="submit"
            className="w-full bg-clay hover:bg-clay-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Guardar y Continuar
          </button>
        </form>
        <p className="mt-6 text-xs text-center text-stone-DEFAULT">
          Puedes obtener tu clave en 
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-accent hover:underline font-semibold"
          >
             Google AI Studio
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyScreen;
