import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import * as geminiService from '../services/geminiService';

describe('App Integration Tests', () => {

    beforeEach(() => {
        // Mock local storage
        Storage.prototype.getItem = vi.fn(key => {
            if (key === 'gemini_api_key') return 'test-api-key';
            if (key === 'geminiWebBuilderChat') return '[]'; // Return valid JSON
            return null;
        });
        Storage.prototype.setItem = vi.fn();

        // Mock API calls
        vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
            if (url === '/api/files.php') {
                return new Response(JSON.stringify({ resources: [{name: 'doc.txt', path: '../resources/doc.txt'}], creations: [] }), { headers: { 'Content-Type': 'application/json' } });
            }
            if (url === '/api/context.php') {
                return new Response(JSON.stringify([{type: 'document', name: 'doc.txt', content: 'Hello world'}]), { headers: { 'Content-Type': 'application/json' } });
            }
            if (url === '/api/save.php') {
                return new Response(JSON.stringify({ status: 'success', message: 'File saved.' }), { headers: { 'Content-Type': 'application/json' } });
            }
            return new Response('Not found', { status: 404 });
        });

        // Mock Gemini Service
        vi.spyOn(geminiService, 'generateInitialCode').mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return '<!DOCTYPE html><html><body><h1>Generated</h1></body></html>';
        });
        vi.spyOn(geminiService, 'modifyCode').mockResolvedValue('<!DOCTYPE html><html><body><h1>Modified</h1></body></html>');
        vi.spyOn(geminiService, 'cleanCodeForSave').mockResolvedValue('<!DOCTYPE html><html><body><h1>Cleaned</h1></body></html>');
    });

    it.skip('should run the full user flow from prompt to save', async () => {
        render(<App />);

        // 1. Home screen renders, FileManager fetches files and context
        await waitFor(() => {
            expect(screen.getByText('Crear desde una descripción')).toBeInTheDocument();
            expect(screen.getByText('doc.txt')).toBeInTheDocument();
        });

        // 2. User types a prompt and creates a page
        const textarea = screen.getByPlaceholderText(/Ej: Una web para una cafetería/i);
        fireEvent.change(textarea, { target: { value: 'test prompt' } });
        fireEvent.click(screen.getByText('Crear'));

        // 3. Editor screen appears with generated content
        await waitFor(() => {
            expect(geminiService.generateInitialCode).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'test prompt', expect.any(String));
        });
        
        await waitFor(() => {
            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
            expect(iframe.srcdoc).toContain('<h1>Generated</h1>');
        });

        // 4. User sends a message to modify the code
        const chatInput = screen.getByPlaceholderText('Pide un cambio o haz una pregunta...');
        fireEvent.change(chatInput, { target: { value: 'change it' } });
        fireEvent.click(screen.getByTestId('send-button'));

        await waitFor(() => {
            expect(geminiService.modifyCode).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(String), 'change it', expect.any(Array), expect.any(String));
        });

        await waitFor(() => {
            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
            expect(iframe.srcdoc).toContain('<h1>Modified</h1>');
        });

        // 5. User saves the file
        const filenameInput = screen.getByPlaceholderText('nombre-del-archivo.html');
        fireEvent.change(filenameInput, { target: { value: 'my-page.html' } });
        fireEvent.click(screen.getByText('Guardar en Servidor'));

        await waitFor(() => {
            expect(geminiService.cleanCodeForSave).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText(/Limpiando y preparando/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Archivo guardado.')).toBeInTheDocument();
        });
    });
});
