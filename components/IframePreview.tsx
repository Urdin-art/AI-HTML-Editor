import React, { useEffect } from 'react';

interface IframePreviewProps {
  htmlContent: string;
  onDeselectAll: () => void;
}

const IframePreview = React.forwardRef<HTMLIFrameElement, IframePreviewProps>(({ htmlContent, onDeselectAll }, ref) => {

  useEffect(() => {
    const iframe = (ref as React.RefObject<HTMLIFrameElement>)?.current;
    if (iframe) {
        iframe.srcdoc = htmlContent;
    }
  }, [htmlContent, ref]);


  return (
    <div className="flex flex-col h-full bg-stone-light">
      <div className="p-2 bg-stone-dark text-stone-light text-sm text-center font-semibold tracking-wider flex justify-between items-center">
        <span>Vista Previa Interactiva</span>
        <button onClick={onDeselectAll} className='text-xs bg-rust-light/50 px-2 py-1 rounded-md hover:bg-rust-light'>Deseleccionar todo</button>
      </div>
      <div className="flex-grow w-full h-full p-4 bg-stone-light">
        <iframe
          ref={ref}
          srcDoc={htmlContent}
          title="Vista Previa"
          className="w-full h-full border-2 border-clay-dark rounded-lg shadow-inner"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
});

export default IframePreview;
