import React from 'react';
import DocumentIcon from './icons/DocumentIcon';
import ImageIcon from './icons/ImageIcon';

interface ChatInputAddonsProps {
    docCount: number;
    imgCount: number;
}

const ChatInputAddons: React.FC<ChatInputAddonsProps> = ({ docCount, imgCount }) => {
    if (docCount === 0 && imgCount === 0) {
        return null;
    }

    return (
        <div className="absolute bottom-16 right-4 flex items-center gap-2 p-2 bg-stone-light/80 rounded-full border border-stone-dark/20 backdrop-blur-sm">
            {docCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-clay-light rounded-full text-xs font-semibold text-clay-dark">
                    <DocumentIcon className="h-4 w-4" />
                    <span>{docCount}</span>
                </div>
            )}
            {imgCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-clay-light rounded-full text-xs font-semibold text-clay-dark">
                    <ImageIcon className="h-4 w-4" />
                    <span>{imgCount}</span>
                </div>
            )}
        </div>
    );
};

export default ChatInputAddons;
