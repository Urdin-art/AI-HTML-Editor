import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MessageAuthor, GeminiModel, FileItem } from "../types";

const SELECTION_CSS = `
.gemini-selectable {
    position: relative;
    transition: all 0.2s ease-in-out;
    border: 2px solid transparent;
}
.gemini-selectable:hover {
    border-color: #E2725B; /* Accent */
    box-shadow: 0 0 10px rgba(226, 114, 91, 0.5);
    cursor: pointer;
}
.gemini-checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10000;
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    background-color: white;
    border: 2px solid #A1523E;
    border-radius: 4px;
}
.gemini-selectable:hover .gemini-checkbox,
.gemini-checkbox:checked {
    opacity: 1;
}
.gemini-selectable[data-gemini-selected="true"] {
    border-color: #A1523E; /* Clay Dark */
    box-shadow: 0 0 10px rgba(139, 69, 19, 0.7);
}
`;

const SELECTION_JS = `
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gemini-selectable').forEach(el => {
        if (el.querySelector('.gemini-checkbox')) {
            return;
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'gemini-checkbox';
        
        checkbox.addEventListener('click', e => {
            e.stopPropagation();
        });

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                el.setAttribute('data-gemini-selected', 'true');
            } else {
                el.removeAttribute('data-gemini-selected');
            }
        });
        
        if (window.getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }
        
        el.appendChild(checkbox);

        if (el.getAttribute('data-gemini-selected') === 'true') {
            checkbox.checked = true;
        }
    });
});
`;

const getInitialSystemPrompt = () => `Eres un desarrollador web experto y un asistente de diseño conversacional. Tu objetivo es ayudar al usuario a crear una página web moderna, atractiva y funcional.
- Interactúa con el usuario para entender sus preferencias de estilo, colores, y contenido. Haz preguntas si la petición inicial es vaga.
- Crea siempre páginas HTML de un solo archivo. TODO el CSS debe estar en una etiqueta <style> y TODO el JS en una etiqueta <script> dentro del mismo archivo HTML.
- Para los iconos, utiliza SVGs incrustados (inline SVG) o caracteres Unicode. NO uses librerías de iconos externas como Font Awesome (ej: kit.fontawesome.com) para evitar problemas de CORS.
- Utiliza imágenes de archivo gratuitas de https://picsum.photos con rutas absolutas, a menos que el usuario proporcione una URL específica o archivos de imagen locales.
- Las páginas deben tener un diseño cuidado, ser responsivas y utilizar animaciones sutiles y efectos para mejorar la experiencia.
- Siempre que generes o modifiques código HTML, debes incluir el mecanismo de selección de elementos.`;

const getInjectionInstructions = () => `INSTRUCCIONES DE INYECCIÓN CRÍTICAS:
1.  En la etiqueta <style> de la página, inyecta el siguiente CSS EXACTAMENTE como se proporciona:
    <style>
    /* ... otro css ... */
    ${SELECTION_CSS}
    </style>
2.  Justo antes de la etiqueta de cierre </body>, inyecta el siguiente JS EXACTAMENTE como se proporciona:
    <script>
    ${SELECTION_JS}
    </script>
3.  Añade la clase