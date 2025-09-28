import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FileManager from '../../components/FileManager';
import { FileItem } from '../../types';

describe('FileManager', () => {
    const mockResources: FileItem[] = [
        { name: 'document.txt', path: '../resources/document.txt', type: 'resource' },
    ];
    const mockCreations: FileItem[] = [
        { name: 'image.jpg', path: '../creations/images/image.jpg', type: 'creation' },
    ];

    beforeEach(() => {
        // Mock the global fetch API for files.php
        vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
            if (url === '/api/files.php') {
                return new Response(JSON.stringify({ 
                    resources: mockResources,
                    creations: mockCreations
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response('Not found', { status: 404 });
        });
    });

    it.skip('should render tabs and fetch files on mount', async () => {
        render(<FileManager onSelectionChange={() => {}} />);
        expect(screen.getByText('Recursos')).toBeInTheDocument();
        expect(screen.getByText('Imágenes')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('document.txt')).toBeInTheDocument();
        });
    });

    it.skip('should display creation files when tab is clicked', async () => {
        render(<FileManager onSelectionChange={() => {}} />);
        fireEvent.click(screen.getByText('Imágenes'));
        await waitFor(() => {
            expect(screen.getByText('image.jpg')).toBeInTheDocument();
        });
    });

    it.skip('should call onSelectionChange with selected files when a checkbox is clicked', async () => {
        const handleSelectionChange = vi.fn();
        render(<FileManager onSelectionChange={handleSelectionChange} />);
        
        let checkbox: HTMLElement;
        await waitFor(() => {
            checkbox = screen.getByLabelText('document.txt');
        });

        // Click to deselect the item (it is selected by default)
        fireEvent.click(checkbox!);

        await waitFor(() => {
            // It should be called with an empty array after deselecting
            expect(handleSelectionChange).toHaveBeenCalledWith([]);
        });

        // Click again to select it
        fireEvent.click(checkbox!);

        await waitFor(() => {
            // It should be called with the mock resource after selecting it again
            expect(handleSelectionChange).toHaveBeenCalledWith(mockResources);
        });
    });
});
