import React, { useState, useEffect, useCallback } from 'react';
import { AppView, ChatMessage, MessageAuthor, GeminiModel, FileItem } from './types';
import HomeScreen from './components/HomeScreen';
import EditorScreen from './components/EditorScreen';
import ApiKeyScreen from './components/ApiKeyScreen';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStep, setSaveStep] = useState<'idle' | 'cleaning' | 'optimizing'>('idle');
  const [model, setModel] = useState<GeminiModel>(GeminiModel.FLASH);
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [aiContext, setAiContext] = useState<string>("");
  const [docCount, setDocCount] = useState<number>(0);
  const [imgCount, setImgCount] = useState<number>(0);
  const [fileManagerKey, setFileManagerKey] = useState<number>(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // If no API key, the ApiKeyScreen will be shown.
    }
    const savedHistory = localStorage.getItem('geminiWebBuilderChat');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if(chatHistory.length > 0) {
      localStorage.setItem('geminiWebBuilderChat', JSON.stringify(chatHistory));
    } else {
      localStorage.removeItem('geminiWebBuilderChat');
    }
  }, [chatHistory]);

  const handleFileSelectionChange = async (files: FileItem[]) => {
    setSelectedFiles(files);

    const docTypes = ['txt', 'md', 'csv', 'json'];
    const imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    let docs = 0;
    let imgs = 0;

    files.forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (docTypes.includes(ext)) {
            docs++;
        } else if (imgTypes.includes(ext)) {
            imgs++;
        }
    });

    setDocCount(docs);
    setImgCount(imgs);

    if (files.length > 0) {
        try {
            const response = await fetch('/api/context.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: files.map(f => f.path) })
            });
            const contextData = await response.json();
            // Simple formatting of the context for the AI prompt
            const formattedContext = contextData.map(item => {
                if (item.type === 'document') {
                    return `Content from ${item.name}:\n${item.content}`;
                }
                if (item.type === 'image') {
                    return `Image available at path "${item.path}". Metadata for ${item.name}: ${item.metadata.width}x${item.metadata.height}, ${item.metadata.mime}`;
                }
                return '';
            }).join('\n\n');
            setAiContext(formattedContext);
        } catch (error) {
            console.error("Error fetching context:", error);
            alert("Error al procesar los archivos de contexto. Por favor, inténtalo de nuevo.");
            setAiContext("");
        }
    } else {
        setAiContext("");
    }
  };

  const handleApiKeySubmit = (newApiKey: string) => {
    localStorage.setItem('gemini_api_key', newApiKey);
    setApiKey(newApiKey);
  };

  const startCreation = useCallback(async (creationFunc: Promise<string>) => {
    if (!apiKey) return;
    setIsLoading(true);
    setChatHistory([]);
    localStorage.removeItem('geminiWebBuilderChat');
    let code = await creationFunc;
    if (code.startsWith('```html')) {
      code = code.slice(7).trim();
    }
    if (code.endsWith('```')) {
      code = code.slice(0, -3).trim();
    }
    setHtmlContent(code);
    setView(AppView.EDITOR);
    setIsLoading(false);
  }, [apiKey, model]);

  const handleCreateFromPrompt = (prompt: string) => {
    if (!apiKey) return;
    setChatHistory([{ author: MessageAuthor.USER, content: prompt }]);
    startCreation(geminiService.generateInitialCode(apiKey, model, prompt, aiContext));
  };

  const handleImportFromCreation = async (filePath: string) => {
    if (!apiKey) return;
    setIsLoading(true);
    try {
        const response = await fetch('/api/get_content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: filePath })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch page content.');
        }
        const cleanHtml = await response.text();

        // Instrument the clean HTML with selection tools via AI
        let instrumentedHtml = await geminiService.prepareImportedHtml(apiKey, model, cleanHtml);

        if (instrumentedHtml.startsWith('```html')) {
            instrumentedHtml = instrumentedHtml.slice(7).trim();
        }
        if (instrumentedHtml.endsWith('```')) {
            instrumentedHtml = instrumentedHtml.slice(0, -3).trim();
        }

        setHtmlContent(instrumentedHtml);
        setChatHistory([{ author: MessageAuthor.SYSTEM, content: `Página \"${filePath}\" cargada y preparada para edición.` }]);
        setView(AppView.EDITOR);
    } catch (error) {
        console.error("Error importing from creation:", error);
        alert("Error al importar la página seleccionada.");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!apiKey) return;
    const newUserMessage: ChatMessage = { author: MessageAuthor.USER, content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    const liveHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || htmlContent;

    const response = await geminiService.modifyCode(apiKey, model, liveHtml, message, updatedHistory, aiContext);
    
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```html')) {
        cleanResponse = cleanResponse.slice(7).trim();
    }
    if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3).trim();
    }
    
    const isHtmlResponse = cleanResponse.startsWith('<!DOCTYPE html>') || (cleanResponse.startsWith('<') && cleanResponse.endsWith('>'));
    
    if (isHtmlResponse) {
        setHtmlContent(cleanResponse);
        setChatHistory(prev => [...prev, { author: MessageAuthor.GEMINI, content: 'Código actualizado.' }]);
    } else {
        setChatHistory(prev => [...prev, { author: MessageAuthor.GEMINI, content: response }]);
    }

    setIsLoading(false);
  };

  const handleClearMemory = () => {
    setChatHistory([]);
    alert('Historial de chat borrado. La próxima conversación empezará desde cero.');
  };
  
  const handleDeselectAll = () => {
    setHtmlContent(htmlContent + ' ');
    setTimeout(() => setHtmlContent(htmlContent), 0);
  };
  
  const handleSave = async (filename: string) => {
    if (!apiKey) return;

    const hasResources = selectedFiles.some(f => f.type === 'resource');
    if (hasResources) {
        const userConfirmed = window.confirm("Se guardará una copia optimizada de las imágenes utilizadas en el diseño y se eliminarán todos los archivos subidos. ¿Quieres continuar?");
        if (!userConfirmed) {
            return;
        }
    }

    setSaveStep('cleaning');

    const usedImages = selectedFiles.filter(file => 
        htmlContent.includes(file.path) || htmlContent.includes(file.name)
    );

    let cleanHtml = await geminiService.cleanCodeForSave(apiKey, model, htmlContent);
    
    if (cleanHtml.startsWith('```html')) {
      cleanHtml = cleanHtml.slice(7).trim();
    }
    if (cleanHtml.endsWith('```')) {
      cleanHtml = cleanHtml.slice(0, -3).trim();
    }

    if (cleanHtml.includes('Error')) {
       const errorMsg = 'Hubo un error al limpiar el código para guardar.';
       console.error(errorMsg, cleanHtml);
       setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: errorMsg }]);
       setSaveStep('idle');
       return;
    }

    setSaveStep('optimizing');

    try {
      console.log(`Iniciando guardado para ${filename}...`);
      const response = await fetch('/api/save.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          htmlContent: cleanHtml, 
          filename: filename,
          usedImages: usedImages.map(f => f.path)
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log('Guardado con éxito:', result);
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: result.message }]);
        setFileManagerKey(prevKey => prevKey + 1); // Trigger file manager refresh
      } else {
        throw new Error(result.message || 'Error desconocido del servidor.');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al guardar el archivo:', err.message);
        alert(`Error al guardar: ${err.message}`);
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: `Error al guardar: ${err.message}` }]);
      } else {
        console.error('Error inesperado al guardar:', err);
        alert('Ocurrió un error inesperado al guardar el archivo.');
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: 'Ocurrió un error inesperado al guardar el archivo.' }]);
      }
    }
    setSaveStep('idle');
  };

  if (!apiKey) {
    return <ApiKeyScreen onApiKeySubmit={handleApiKeySubmit} />;
  }

  if (view === AppView.HOME) {
    return <HomeScreen onCreateFromPrompt={handleCreateFromPrompt} onImportFromCreation={handleImportFromCreation} isLoading={isLoading} onFileSelectionChange={handleFileSelectionChange} currentModel={model} onModelChange={setModel} fileManagerKey={fileManagerKey} />;
  }

  return (
    <EditorScreen
      htmlContent={htmlContent}
      chatMessages={chatHistory}
      onSendMessage={handleSendMessage}
      onClearMemory={handleClearMemory}
      onDeselectAll={handleDeselectAll}
      onSave={handleSave}
      isChatLoading={isLoading}
      saveStep={saveStep}
      currentModel={model}
      onModelChange={setModel}
      onFileSelectionChange={handleFileSelectionChange}
      docCount={docCount}
      imgCount={imgCount}
      fileManagerKey={fileManagerKey}
      iframeRef={iframeRef}
    />
  );
};

export default App;
