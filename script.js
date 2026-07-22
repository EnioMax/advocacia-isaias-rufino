// 1. Funções de Acessibilidade (mantidas)
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

// 1.1 Leitura de voz (Text-to-Speech) - usada pelos botões "Ouvir Seção" / "Ouvir Site"
let sintetizadorAtivo = false;
function lerSecao(idElemento) {
    // Se já estiver lendo, um novo clique interrompe a leitura (toggle)
    if (sintetizadorAtivo) {
        window.speechSynthesis.cancel();
        sintetizadorAtivo = false;
        return;
    }

    if (!('speechSynthesis' in window)) {
        alert("Seu navegador não oferece suporte à leitura em voz alta.");
        return;
    }

    const elemento = document.getElementById(idElemento);
    if (!elemento) return;

    // innerText pega apenas o texto visível, ignorando tags e scripts
    const texto = elemento.innerText.trim();
    if (!texto) return;

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 0.95;

    fala.onstart = () => { sintetizadorAtivo = true; };
    fala.onend = () => { sintetizadorAtivo = false; };
    fala.onerror = () => { sintetizadorAtivo = false; };

    window.speechSynthesis.cancel(); // evita sobrepor leituras
    window.speechSynthesis.speak(fala);
}

// 2. NOVA FUNÇÃO DE LIMPEZA (Essencial)
function limparValor(valor) {
    // Remove tudo que não é número, vírgula ou ponto
    let valorLimpo = valor.replace(/\./g, '').replace(',', '.');
    return parseFloat(valorLimpo);
}

// 3. Lógica da Calculadora - Tese da Taxa Média de Mercado (Bacen)
// Taxa de referência mensal usada como benchmark (mantenha atualizada conforme
// a taxa média de mercado divulgada pelo Banco Central para consignado).
const TAXA_REFERENCIA_BACEN_MENSAL = 0.0185; // 1,85% a.m.

// Calcula a taxa de juros efetiva mensal embutida no contrato (método de
// bisseção sobre a fórmula de prestação de uma série uniforme - Price).
function calcularTaxaEfetiva(valorEmprestimo, valorParcela, qtdParcelas) {
    function prestacaoParaTaxa(i) {
        if (i <= 0) return valorEmprestimo / qtdParcelas;
        const fator = (1 - Math.pow(1 + i, -qtdParcelas)) / i;
        return valorEmprestimo / fator;
    }

    let baixo = 0.0001, alto = 0.30; // faixa plausível: 0,01% a 30% a.m.
    for (let iter = 0; iter < 100; iter++) {
        const meio = (baixo + alto) / 2;
        const prestacaoTeste = prestacaoParaTaxa(meio);
        if (prestacaoTeste > valorParcela) {
            alto = meio;
        } else {
            baixo = meio;
        }
    }
    return (baixo + alto) / 2;
}

function calcularRestituicao() {
    const vEmp = limparValor(document.getElementById('valorEmprestimo').value);
    const vPar = limparValor(document.getElementById('valorParcela').value);
    const qPar = parseFloat(document.getElementById('qtdParcelas').value);

    if (isNaN(vEmp) || isNaN(vPar) || isNaN(qPar) || vEmp <= 0 || vPar <= 0 || qPar <= 0) {
        alert("Por favor, preencha todos os campos da simulação corretamente.");
        return;
    }

    const totalPago = vPar * qPar;

    // Taxa efetiva que o banco está cobrando neste contrato
    const taxaEfetivaMensal = calcularTaxaEfetiva(vEmp, vPar, qPar);

    // Quanto seria pago se a taxa cobrada fosse a taxa de referência do Bacen
    const fatorJusto = (1 - Math.pow(1 + TAXA_REFERENCIA_BACEN_MENSAL, -qPar)) / TAXA_REFERENCIA_BACEN_MENSAL;
    const parcelaJusta = vEmp / fatorJusto;
    const totalJusto = parcelaJusta * qPar;

    const excesso = totalPago - totalJusto;

    const resultadoDiv = document.getElementById('resultadoCalculadora');
    const valorSpan = document.getElementById('valorEstimado');

    if (excesso <= 0) {
        // Taxa cobrada está dentro (ou abaixo) da referência de mercado
        valorSpan.innerText = "Dentro da média de mercado";
        resultadoDiv.classList.remove('hidden');
        return;
    }

    // Repetição de Indébito (Art. 42, CDC) - devolução em dobro do valor pago indevidamente
    const estimativaRestituicao = excesso * 2;

    valorSpan.innerText = "R$ " + estimativaRestituicao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    resultadoDiv.classList.remove('hidden');

    // Guarda o valor para uso no envio ao CRM (enviarParaCRM lê o innerText da tela)
    resultadoDiv.dataset.taxaEfetiva = (taxaEfetivaMensal * 100).toFixed(2);
}

// 4. Integração com Trello (mantida)
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