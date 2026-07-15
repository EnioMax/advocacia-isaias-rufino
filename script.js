// ==========================================================================
// FUNÇÕES DE ACESSIBILIDADE
// ==========================================================================
let tamanhoBase = 100; 
function alterarFonte(direcao) {
    tamanhoBase += (direcao * 10);
    if (tamanhoBase < 80) tamanhoBase = 80;    
    if (tamanhoBase > 150) tamanhoBase = 150;  
    document.documentElement.style.fontSize = tamanhoBase + "%";
}
function resetarFonte() {
    tamanhoBase = 100;
    document.documentElement.style.fontSize = "100%";
}
function alternarContraste() {
    document.documentElement.classList.toggle('alto-contraste');
}
function lerSecao(idElemento) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        const textoParaLer = elemento.innerText;
        const enunciado = new SpeechSynthesisUtterance(textoParaLer);
        enunciado.lang = 'pt-BR';
        enunciado.rate = 1.1; 
        window.speechSynthesis.speak(enunciado);
    }
}

// ==========================================================================
// FUNÇÕES DA CALCULADORA (CORRIGIDAS)
// ==========================================================================
function calcularRestituicao() {
    const vEmp = parseFloat(document.getElementById('valorEmprestimo').value);
    const vPar = parseFloat(document.getElementById('valorParcela').value);
    const qPar = parseFloat(document.getElementById('qtdParcelas').value);

    if (isNaN(vEmp) || isNaN(vPar) || isNaN(qPar)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const totalPago = vPar * qPar;
    const estimativa = (totalPago - vEmp) * 0.15; 

    document.getElementById('valorEstimado').innerText = "R$ " + estimativa.toFixed(2);
    document.getElementById('resultadoCalculadora').classList.remove('hidden');
} // <-- REMOVIDO O "}" QUE ESTAVA SOBRANDO AQUI

// ==========================================================================
// INTEGRAÇÃO COM CRM TRELLO
// ==========================================================================
async function enviarParaCRM() {
    const nome = document.getElementById('nomeLead').value;
    const whats = document.getElementById('whatsappLead').value;
    const valor = document.getElementById('valorEstimado').innerText;

    if(!nome || !whats) { 
        alert("Por favor, preencha seu nome e WhatsApp para receber o contato."); 
        return; 
    }

    // Endereço secreto do seu Trello
    const emailTrello = "eniomax+ootuorbtwc3tadmsiwlu@boards.trello.com";
    
    // Criamos o conteúdo que será enviado
    const assunto = `NOVO LEAD: ${nome} - Restituição: ${valor}`;
    const corpo = `Nome: ${nome}\nWhatsApp: ${whats}\nValor Estimado: ${valor}\nData: ${new Date().toLocaleDateString('pt-BR')}`;

    // Para o seu primeiro projeto, vamos usar o serviço FormSubmit (Grátis e sem cadastro complexo)
    // Ele enviará os dados direto para o seu e-mail do Trello
    try {
        const response = await fetch("https://formsubmit.co/ajax/" + emailTrello, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: assunto,
                message: corpo
            } )
        });

        if (response.ok) {
            alert("Dados enviados com sucesso! O Dr. Isaías Rufino entrará em contato em breve.");
            // Limpa o formulário após o envio
            document.getElementById('nomeLead').value = "";
            document.getElementById('whatsappLead').value = "";
        } else {
            alert("Ocorreu um erro ao enviar. Por favor, tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro na integração:", error);
        alert("Erro de conexão. Verifique sua internet.");
    }
}

    