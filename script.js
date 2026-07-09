// ==========================================================================
// CONTROLE DE ACESSIBILIDADE DE FONTE
// ==========================================================================

// Mantém o estado atual da escala da fonte em porcentagem (100% = base original)
let tamanhoBase = 100; 

/**
 * Altera o tamanho da fonte do documento proporcionalmente.
 * @param {number} direcao - Use 1 para aumentar e -1 para diminuir.
 */
function alterarFonte(direcao) {
    // Aumenta ou diminui de 10% em 10%
    tamanhoBase += (direcao * 10);
    
    // Limites técnicos de segurança para impedir que a interface quebre
    if (tamanhoBase < 80) tamanhoBase = 80;    
    if (tamanhoBase > 150) tamanhoBase = 150;  
    
    // Aplica a nova escala diretamente na tag raiz <html>
    document.documentElement.style.fontSize = tamanhoBase + "%";
}

/**
 * Reseta o tamanho do texto instantaneamente para o padrão original de 100%.
 */
function resetarFonte() {
    tamanhoBase = 100;
    document.documentElement.style.fontSize = "100%";
}

// ==========================================================================
// CONTROLE DO MODO ALTO CONTRASTE
// ==========================================================================

/**
 * Alterna a classe de alto contraste no corpo da página.
 */
function alternarContraste() {
    document.body.classList.toggle('alto-contraste');
}

// ==========================================================================
// MOTOR TTS (TEXT-TO-SPEECH) NATIVO DO NAVEGADOR
// ==========================================================================

/**
 * Captura o conteúdo de texto de uma seção específica e realiza a leitura por voz.
 * Atua também como botão "Mute/Parar" se for clicado enquanto o áudio estiver tocando.
 * @param {string} idElemento - O ID do elemento HTML contendo o texto a ser lido.
 */
function lerSecao(idElemento) {
    // Se o navegador já estiver executando uma leitura, o clique cancela a fala atual (Mute)
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }
    
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        // Extrai apenas as strings textuais limpas de dentro do bloco, pulando as tags HTML
        const textoParaLer = elemento.innerText;
        
        // Inicializa o motor de voz nativo do navegador
        const enunciado = new SpeechSynthesisUtterance(textoParaLer);
        
        // Define as configurações de idioma e velocidade fluida
        enunciado.lang = 'pt-BR';
        enunciado.rate = 1.1; // Velocidade 10% ligeiramente acelerada para uma audição menos cansativa
        
        // Executa a voz
        window.speechSynthesis.speak(enunciado);
    }
}