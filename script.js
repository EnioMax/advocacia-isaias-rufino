// 1. Funções de Acessibilidade
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

// 2. Lógica da Calculadora
function calcularRestituicao() {
    const vEmp = parseFloat(document.getElementById('valorEmprestimo').value);
    const vPar = parseFloat(document.getElementById('valorParcela').value);
    const qPar = parseFloat(document.getElementById('qtdParcelas').value);

    if (isNaN(vEmp) || isNaN(vPar) || isNaN(qPar)) {
        alert("Por favor, preencha todos os campos da simulação.");
        return;
    }

    // Lógica realista: Foca nos juros pagos (diferença entre o que foi pago e o capital)
    const totalPago = vPar * qPar;
    const jurosPagos = totalPago - vEmp;
    
    // Estimativa de abusividade: 15% dos juros pagos como indício médio de mercado
    const estimativa = jurosPagos * 0.15;

    // Atualiza o valor mantendo a formatação visual e exibindo o resultado
    document.getElementById('valorEstimado').innerText = "R$ " + estimativa.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('resultadoCalculadora').classList.remove('hidden');
}

// 3. Integração com Trello
async function enviarParaCRM() {
    const nome = document.getElementById('nomeLead').value;
    const whats = document.getElementById('whatsappLead').value;
    const valor = document.getElementById('valorEstimado').innerText;
    const emailTrello = "eniomax+ootuorbtwc3tadmsiwlu@boards.trello.com";

    if(!nome || !whats) {
        alert("Preencha seu nome e WhatsApp para o Dr. Isaías entrar em contato.");
        return;
    }

    const assunto = `NOVO LEAD: ${nome} - ${valor}`;
    const corpo = `Nome: ${nome}\nWhatsApp: ${whats}\nValor Estimado: ${valor}\nData: ${new Date().toLocaleString('pt-BR')}`;

    try {
        const response = await fetch("https://formsubmit.co/ajax/" + emailTrello, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ _subject: assunto, message: corpo } )
        });
        if (response.ok) {
            alert("Solicitação enviada com sucesso! Em breve, entraremos em contato.");
            document.getElementById('resultadoCalculadora').classList.add('hidden');
        }
    } catch (e) {
        alert("Erro ao enviar. Tente novamente.");
    }
}
