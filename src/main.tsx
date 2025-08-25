import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { disablePageZoom } from './lib/disable-zoom.ts'

// Desabilitar zoom da página assim que a aplicação inicializar
// Esta função é chamada antes do React ser inicializado para garantir
// que o zoom seja desabilitado desde o primeiro carregamento
disablePageZoom();

createRoot(document.getElementById("root")!).render(<App />);
