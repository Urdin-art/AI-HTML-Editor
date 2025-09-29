import React, { useState, useEffect, useCallback } from 'react';
import { FileItem } from '../types';

interface FileManagerProps {
    onSelectionChange: (selectedFiles: FileItem[]) => void;
    fileManagerKey?: number;
}

const FileManager: React.FC<FileManagerProps> = ({ onSelectionChange, fileManagerKey }) => {
    const [activeTab, setActiveTab] = useState<'resources' | 'creations'>('resources');
    const [resources, setResources] = useState<FileItem[]>([]);
    const [creations, setCreations] = useState<FileItem[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        try {
            const response = await fetch('/api/files.php');
            if (!response.ok) throw new Error('Failed to fetch files.');
            const data = await response.json();
            const newResources = (data.resources || []).map((f: any) => ({ ...f, type: 'resource' }));
            const newCreations = (data.creations || []).map((f: any) => ({ ...f, type: 'creation' }));
            setResources(newResources);
            setCreations(newCreations);
            // Reset selection, keeping only items that still exist
            setSelectedFiles(prevSelected => {
                const allNewPaths = [...newResources.map(f => f.path), ...newCreations.map(f => f.path)];
                return prevSelected.filter(p => allNewPaths.includes(p));
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles, fileManagerKey]);

    // Notify parent component when selection changes
    const handleCheckboxChange = (file: FileItem) => {
        const newSelection = selectedFiles.includes(file.path)
            ? selectedFiles.filter(p => p !== file.path)
            : [...selectedFiles, file.path];
        
        setSelectedFiles(newSelection);

        const allFiles = [...resources, ...creations];
        const selection = allFiles.filter(f => newSelection.includes(f.path));
        onSelectionChange(selection);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const allowedImageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'csv', 'json'];
        const allowedDocExts = ['txt', 'md', 'csv', 'json'];
        const maxImageSize = 10 * 1024 * 1024; // 10 MB
        const maxDocSize = 1 * 1024 * 1024;   // 1 MB

        const validFiles = Array.from(files).filter(file => {
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            if (!fileExt) return false;

            if (allowedImageExts.includes(fileExt)) {
                if (file.size > maxImageSize) {
                    alert(`Error: El archivo de imagen ${file.name} excede el límite de 10 MB.`);
                    return false;
                }
                return true;
            } else if (allowedDocExts.includes(fileExt)) {
                if (file.size > maxDocSize) {
                    alert(`Error: El archivo de documento ${file.name} excede el límite de 1 MB.`);
                    return false;
                }
                return true;
            } else {
                alert(`Error: El tipo de archivo ${file.name} no es válido.`);
                return false;
            }
        });

        if (validFiles.length === 0) return;

        setIsUploading(true);
        setError(null);
        const uploadPromises = validFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload.php', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || 'Upload failed');
            }
        });

        try {
            await Promise.all(uploadPromises);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during upload.';
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsUploading(false);
            fetchFiles();
        }
    };

    const filesToShow = activeTab === 'resources' ? resources : creations;

    return (
        <div className="file-manager bg-stone-light p-4 rounded-lg shadow-md">
            <div className="upload-section mb-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-stone-dark mb-2">Sube o selecciona los elementos que quieres que la ia utilice durante la creación de tu página</label>
                <input 
                    id="file-upload"
                    type="file" 
                    multiple 
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-stone-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-clay-light file:text-clay-dark hover:file:bg-clay disabled:opacity-50"
                />
                 {isUploading && <p className="text-sm text-stone-dark">Subiendo archivos...</p>}
                 {error && <p className="text-sm text-rust-dark mt-1">{error}</p>}
            </div>

            <div className="tabs border-b border-clay-dark">
                <button 
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'resources' ? 'border-b-2 border-clay-dark text-clay-dark' : 'text-stone-dark'}`}>
                    Recursos
                </button>
                <button 
                    onClick={() => setActiveTab('creations')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'creations' ? 'border-b-2 border-clay-dark text-clay-dark' : 'text-stone-dark'}`}>
                    Imágenes
                </button>
            </div>

            <div className="file-list h-48 overflow-y-auto mt-2 p-2 bg-white rounded">
                {filesToShow.map(file => (
                    <div key={file.path} className="flex items-center justify-between p-1">
                        <label htmlFor={file.path} className="text-sm text-stone-dark truncate">{file.name}</label>
                        <input 
                            type="checkbox" 
                            id={file.path} 
                            name={file.name}
                            aria-label={file.name}
                            checked={selectedFiles.includes(file.path)}
                            onChange={() => handleCheckboxChange(file)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileManager;
