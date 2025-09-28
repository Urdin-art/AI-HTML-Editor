import React, { useState, useEffect, useCallback } from 'react';
import { AppView, ChatMessage, MessageAuthor, GeminiModel } from './types';
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [model, setModel] = useState<GeminiModel>(GeminiModel.FLASH);

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
    startCreation(geminiService.generateInitialCode(apiKey, model, prompt));
  };

  const handleCreateFromUrl = (url: string) => {
    if (!apiKey) return;
    setChatHistory([{ author: MessageAuthor.USER, content: `Cargar y modificar la página desde la URL: ${url}` }]);
    startCreation(geminiService.processUrlHtml(apiKey, model, url));
  };

  const handleSendMessage = async (message: string) => {
    if (!apiKey) return;
    const newUserMessage: ChatMessage = { author: MessageAuthor.USER, content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    const response = await geminiService.modifyCode(apiKey, model, htmlContent, message, updatedHistory);
    
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
    setIsSaving(true);
    let cleanHtml = await geminiService.cleanCodeForSave(apiKey, model, htmlContent);
    
    if (cleanHtml.startsWith('```html')) {
      cleanHtml = cleanHtml.slice(7).trim();
    }
    if (cleanHtml.endsWith('```')) {
      cleanHtml = cleanHtml.slice(0, -3).trim();
    }

    if (cleanHtml.includes('Error')) {
       setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: 'Hubo un error al limpiar el código para guardar.' }]);
       setIsSaving(false);
       return;
    }

    try {
      const response = await fetch('/api/save.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          htmlContent: cleanHtml, 
          filename: filename 
        }),
      });

      if (!response.ok) {
        // If response is not OK, get the error message from the body as text
        const errorText = await response.text();
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: result.message }]);
      } else {
        throw new Error(result.message || 'Error desconocido del servidor.');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error saving file:', err);
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: `Error al guardar: ${err.message}` }]);
      } else {
        setChatHistory(prev => [...prev, { author: MessageAuthor.SYSTEM, content: 'Ocurrió un error inesperado al guardar el archivo.' }]);
      }
    }
    setIsSaving(false);
  };

  if (!apiKey) {
    return <ApiKeyScreen onApiKeySubmit={handleApiKeySubmit} />;
  }

  if (view === AppView.HOME) {
    return <HomeScreen onCreateFromPrompt={handleCreateFromPrompt} onCreateFromUrl={handleCreateFromUrl} isLoading={isLoading} />;
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
      isSaving={isSaving}
      currentModel={model}
      onModelChange={setModel}
    />
  );
};

export default App;
