// Configuração de envio (EmailJS)
(function() { emailjs.init("SEU_USER_ID"); })();

const params = new URLSearchParams(window.location.search);
const numSala = params.get('sala') || "1";

const FLUXO = [
    { id: 'suja', label: 'Retirada de <br> Paciente', msg: 'A sala está suja' },
    { id: 'higienizando', label: 'Limpeza <br> iniciada', msg: 'Em higienização' },
    { id: 'higienizada', label: 'Limpeza <br> concluída', msg: 'Higienizada' },
    { id: 'organizando', label: 'Organizando <br> a sala', msg: 'Em organização' },
    { id: 'disponivel', label: 'Sala pronta <br> para cirurgia', msg: 'Disponível' },
    { id: 'cirurgia', label: 'Cirurgia <br> iniciada', msg: 'Em Cirurgia' }
];

let faseIdx = 0;
let tempoInicio = null;
let registros = { limpeza: 0, organizacao: 0, cirurgia: 0 };

const btnStatus = document.getElementById('status-action');

function atualizarPagina() {
    btnStatus.innerHTML = `<span>${FLUXO[faseIdx].label}</span>`;
    document.getElementById('screen-title').innerText = `Controle - Sala ${numSala}`;
}

btnStatus.addEventListener('click', () => {
    const agora = Date.now();
    const faseAtual = FLUXO[faseIdx].id;

    // Lógica de Cronometragem
    if (faseAtual === 'higienizando') {
        registros.limpeza = calcularMinutos(tempoInicio, agora);
    } else if (faseAtual === 'organizando') {
        registros.organizacao = calcularMinutos(tempoInicio, agora);
    } else if (faseAtual === 'cirurgia') {
        registros.cirurgia = calcularMinutos(tempoInicio, agora);
        enviarEmailRelatorio();
    }

    // Avançar fase e iniciar novo tempo se for ação
    faseIdx = (faseIdx + 1) % FLUXO.length;
    tempoInicio = Date.now();
    atualizarPagina();
});

function calcularMinutos(inicio, fim) {
    return Math.floor((fim - inicio) / 60000);
}

function enviarEmailRelatorio() {
    const dados = {
        sala: numSala,
        email_destino: "felipedias777@gmail.com",
        limpeza: registros.limpeza + " min",
        organizacao: registros.organizacao + " min",
        cirurgia: registros.cirurgia + " min",
        data: new Date().toLocaleDateString('pt-BR')
    };

    emailjs.send("service_id", "template_id", dados)
        .then(() => alert("Relatório de ciclo enviado com sucesso!"));
}

// Atualizar Relógio (Canto inferior esquerdo)
setInterval(() => {
    const d = new Date();
    document.getElementById('digital-clock').innerText = 
        `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}, 1000);

atualizarPagina();