import React, { useRef, useEffect } from 'react';

interface IframePreviewProps {
  htmlContent: string;
}

const IframePreview: React.FC<IframePreviewProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
        iframeRef.current.srcdoc = htmlContent;
    }
  }, [htmlContent]);


  return (
    <div className="flex flex-col h-full bg-stone-light">
      <div className="p-2 bg-stone-dark text-stone-light text-sm text-center font-semibold tracking-wider">
        Vista Previa Interactiva
      </div>
      <div className="flex-grow w-full h-full p-4 bg-stone-light">
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          title="Vista Previa"
          className="w-full h-full border-2 border-clay-dark rounded-lg shadow-inner"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default IframePreview;
