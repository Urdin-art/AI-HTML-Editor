import { GoogleGenerativeAI } from "@google/generative-ai";
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

const getInitialSystemPrompt = () => `Eres un desarrollador web experto y un asistente de diseño conversacional. Tu objetivo es ayudar al usuario a crear una página web moderna, atractiva y funcional.\n- **PRIORIDAD MÁXIMA:** Si el usuario proporciona archivos (imágenes o documentos), DEBES usarlos. Tu primera prioridad es siempre utilizar los recursos del usuario en lugar de imágenes o texto de relleno. Si el prompt del usuario es ambiguo sobre cómo usar un archivo, DEBES hacer una pregunta para clarificarlo en lugar de ignorar el archivo.\n- **¡REGLA CRÍTICA!** Para todas las etiquetas <img> que utilices, DEBES incluir siempre los atributos \`width\` y \`height\` con valores numéricos en píxeles (ej: \`width=\"800\"\` \`height=\"600\"\`). Esto es obligatorio para que la optimización de imágenes funcione.\n- Interactúa con el usuario para entender sus preferencias de estilo, colores, y contenido. Haz preguntas si la petición inicial es vaga.\n- Crea siempre páginas HTML de un solo archivo. TODO el CSS debe estar en una etiqueta <style> y TODO el JS en una etiqueta <script> dentro del mismo archivo HTML.\n- Para los iconos, utiliza SVGs incrustados (inline SVG) o caracteres Unicode. NO uses librerías de iconos externas como Font Awesome (ej: kit.fontawesome.com) para evitar problemas de CORS.\n- Utiliza imágenes de archivo gratuitas de https://picsum.photos con rutas absolutas, a menos que el usuario proporcione una URL específica o archivos de imagen locales.\n- Las páginas deben tener un diseño cuidado, ser responsivas y utilizar animaciones sutiles y efectos para mejorar la experiencia.\n- Siempre que generes o modifiques código HTML, debes incluir el mecanismo de selección de elementos.`;

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
3.  Añade la clase "gemini-selectable" a los elementos importantes de la página (sections, headers, divs principales, bloques de texto, imágenes, etc.) para que puedan ser seleccionados por el usuario.`;

export const generateInitialCode = async (apiKey: string, model: GeminiModel, prompt: string, aiContext: string): Promise<string> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const fullPrompt = `
    ${getInitialSystemPrompt()}

    ${aiContext}

    La petición del usuario es: "${prompt}".

    Crea el código HTML completo para esta página siguiendo todas las instrucciones.

    ${getInjectionInstructions()}
    
    Responde ÚNICAMENTE con el código HTML completo. No incluyas explicaciones adicionales.`;

    try {
        const generativeModel = genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating initial code:", error);
        return "<html><body><h1>Error al generar el código. Revisa tu API Key y vuelve a intentarlo.</h1></body></html>";
    }
};

export const processUrlHtml = async (apiKey: string, model: GeminiModel, url: string, aiContext: string): Promise<string> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const fullPrompt = `
    ${getInitialSystemPrompt()}

    ${aiContext}

    Primero, obtén el contenido HTML de esta URL: ${url}.
    Luego, modifica ese HTML para añadir el mecanismo de selección de elementos.

    ${getInjectionInstructions()}

    Responde ÚNICAMENTE con el código HTML completo y modificado. No incluyas explicaciones adicionales.`;
    
    try {
        const generativeModel = genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error processing URL:", error);
        return "<html><body><h1>Error al procesar la URL. Asegúrate de que es accesible públicamente y que tu API Key es correcta.</h1></body></html>";
    }
};

export const modifyCode = async (apiKey: string, model: GeminiModel, fullHtml: string, userPrompt: string, chatHistory: ChatMessage[], aiContext: string): Promise<string> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const historyText = chatHistory
        .filter(msg => msg.author !== MessageAuthor.SYSTEM)
        .map(msg => `${msg.author}: ${msg.content}`)
        .join('\n');

    const fullPrompt = `
    Eres un desarrollador web experto. El usuario quiere modificar una página web.
    
    HISTORIAL DE LA CONVERSACIÓN:
    ${historyText}

    ${aiContext}

    CÓDIGO HTML ACTUAL:
    \
    ${fullHtml}
    \

    PETICIÓN DEL USUARIO: "${userPrompt}"

    INSTRUCCIONES DE MODIFICACIÓN:
    - Los elementos marcados con el atributo 'data-gemini-selected="true"' son los que el usuario quiere cambiar específicamente.
    - SI HAY ELEMENTOS SELECCIONADOS: DEBES limitar tus cambios ÚNICAMENTE a esos elementos. No modifiques ninguna otra parte del código.
    - SI NO HAY NINGÚN ELEMENTO SELECCIONADO: Tienes libertad para modificar cualquier parte del código para cumplir con la petición del usuario.
    - Asegúrate de que el mecanismo de selección (clases "gemini-selectable", CSS y JS inyectados) se mantiene intacto en tu respuesta.

    REGLAS DE RESPUESTA:
    - Si necesitas hacer preguntas o dar aclaraciones, responde ÚNICAMENTE con texto plano.
    - Si realizas cambios en el código, tu respuesta DEBE ser ÚNICAMENTE el código HTML COMPLETO Y ACTUALIZADO. No incluyas markdown (\
), explicaciones, ni ningún otro texto. Tu respuesta debe empezar directamente con <!DOCTYPE html>.
    `;
    
    try {
        const generativeModel = genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error modifying code:", error);
        return fullHtml; // Return original html on error
    }
};

export const cleanCodeForSave = async (apiKey: string, model: GeminiModel, fullHtml: string): Promise<string> => {
     const genAI = new GoogleGenerativeAI(apiKey);
     const fullPrompt = `
    Eres un experto en limpieza de código. Toma el siguiente código HTML y elimina todo lo relacionado con la funcionalidad de selección de elementos para dejar una versión final y limpia.

    Instrucciones específicas de limpieza:
    1. Elimina el bloque de CSS correspondiente a las clases '.gemini-selectable' y '.gemini-checkbox'.
    2. Elimina la etiqueta <script> que contiene la lógica de selección de elementos (el listener para DOMContentLoaded).
    3. Elimina del HTML todos los elementos <input> con la clase "gemini-checkbox".
    4. Elimina todos los atributos 'data-gemini-selected' de cualquier elemento.
    5. Elimina todas las clases "gemini-selectable" de cualquier elemento.
    6. ¡MUY IMPORTANTE! Al eliminar los elementos anteriores (bordes, checkboxes, etc.), el diseño puede desplazarse. Tu tarea principal es asegurarte de que el resultado final sea VISUALMENTE IDÉNTICO al diseño original. Si es necesario, ajusta márgenes, paddings o estilos para compensar el espacio que ocupaban los elementos eliminados y que nada se descuadre.

    CÓDIGO HTML A LIMPIAR:
    \
    ${fullHtml}
    \

    Responde ÚNICAMENTE con el código HTML limpio y final. No añadas explicaciones.
    `;
    
    try {
        const generativeModel = genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error cleaning code:", error);
        return "<html><body><h1>Error al limpiar el código.</h1></body></html>";
    }
}