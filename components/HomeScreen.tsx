
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import FileManager from './FileManager';
import { FileItem, GeminiModel } from '../types';
import ModelSelector from './ModelSelector';

interface PageFile {
    name: string;
    path: string;
}

interface HomeScreenProps {
  onCreateFromPrompt: (prompt: string) => void;
  onImportFromCreation: (filePath: string) => void;
  isLoading: boolean;
  onFileSelectionChange: (files: FileItem[]) => void;
  currentModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  fileManagerKey: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateFromPrompt, onImportFromCreation, isLoading, onFileSelectionChange, currentModel, onModelChange, fileManagerKey }) => {
  const [prompt, setPrompt] = useState('');
  const [pages, setPages] = useState<PageFile[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');

  useEffect(() => {
    const fetchPages = async () => {
        try {
            const response = await fetch('/api/files.php');
            const data = await response.json();
            if (data.pages) {
                setPages(data.pages);
                if (data.pages.length > 0) {
                    setSelectedPage(data.pages[0].path);
                }
            }
        } catch (error) {
            console.error("Failed to fetch pages:", error);
        }
    };
    fetchPages();
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onCreateFromPrompt(prompt);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPage) {
      onImportFromCreation(selectedPage);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-stone-light p-4">
        <div className="text-center mb-10">
            <h1 className="text-6xl font-bold text-clay-dark tracking-tight">Crea Webs con IA</h1>
            <p className="text-stone-DEFAULT text-xl mt-4 max-w-2xl">Describe la web que imaginas, o importa una existente para modificarla. La IA la construirá para ti.</p>
        </div>

        {isLoading ? (
            <div className="bg-white/60 p-8 rounded-lg shadow-2xl flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-clay-dark font-semibold">Generando tu web...</p>
            </div>
        ) : (
            <div className="w-full max-w-4xl">
                <div className="mb-8 max-w-sm mx-auto">
                    <ModelSelector currentModel={currentModel} onModelChange={onModelChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-2xl border-2 border-clay-dark">
                        <h2 className="text-2xl font-bold mb-4 text-clay-dark">Crear desde una descripción</h2>
                        <form onSubmit={handlePromptSubmit}>
                            <textarea
                                className="w-full p-3 border-2 border-clay rounded-md focus:ring-2 focus:ring-accent focus:border-accent resize-none transition-shadow"
                                rows={4}
                                placeholder="Ej: Una web para una cafetería de estilo rústico, con tonos tierra, un menú y un mapa..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <button type="submit" className="mt-4 w-full bg-clay hover:bg-clay-dark text-white font-bold py-3 px-4 rounded-md transition-colors duration-300">
                                Crear
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-2xl border-2 border-clay-dark">
                        <h2 className="text-2xl font-bold mb-4 text-clay-dark">Importar una creación</h2>
                        <form onSubmit={handleImportSubmit}>
                            <select 
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(e.target.value)}
                                className="w-full p-3 border-2 border-clay rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-white"
                                disabled={pages.length === 0}
                            >
                                {pages.length === 0 ? (
                                    <option>No hay páginas creadas</option>
                                ) : (
                                    pages.map(page => (
                                        <option key={page.path} value={page.path}>{page.name}</option>
                                    ))
                                )}
                            </select>
                            <button type="submit" className="mt-4 w-full bg-rust-light hover:bg-rust text-white font-bold py-3 px-4 rounded-md transition-colors duration-300" disabled={pages.length === 0}>
                                Importar y Editar
                            </button>
                        </form>
                    </div>
                    <div className="md:col-span-2">
                        <FileManager onSelectionChange={onFileSelectionChange} key={fileManagerKey} />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default HomeScreen;
