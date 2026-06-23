const formReserva = document.getElementById('formReserva');
const inputPessoas = document.getElementById('pessoas');
const inputHorario = document.getElementById('horarioSelecionado');

// Adiciona efeito de scroll na navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar-kenji');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Lógica de + e - (1 a 10)
document.getElementById('btnInc').addEventListener('click', () => {
    let val = parseInt(inputPessoas.value);
    if (val < 10) inputPessoas.value = val + 1;
});
document.getElementById('btnDec').addEventListener('click', () => {
    let val = parseInt(inputPessoas.value);
    if (val > 1) inputPessoas.value = val - 1;
});

// Seleção de horário
document.querySelectorAll('.btn-time').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-time').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        inputHorario.value = this.getAttribute('data-time');
    });
});

// Envio e Modal
formReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const horario = inputHorario.value;
    const qtd = inputPessoas.value;

    if (!horario) return alert("Selecione um horário!");

    document.getElementById('mensagemConfirmacao').innerText = 
        `Nome: ${nome}, seu agendamento foi confirmado para o dia ${data}, às ${horario}, com ${qtd} pessoas. Obrigado por escolher o Kenji Restaurante Oriental.`;
    
    new bootstrap.Modal(document.getElementById('modalConfirmacao')).show();

    // Dentro do evento de submit, substitua o bloco que define o texto:

const msg = `
    <ul style="list-style: none; padding: 0; text-align: left; width: 80%; margin: 0 auto;">
        <li style="margin-bottom: 10px;"><strong>Nome:</strong> ${nome}</li>
        <li style="margin-bottom: 10px;"><strong>Data:</strong> ${data}</li>
        <li style="margin-bottom: 10px;"><strong>Horário:</strong> ${horario}</li>
        <li style="margin-bottom: 10px;"><strong>Pessoas:</strong> ${qtd}</li>
    </ul>
    <p style="margin-top: 20px; font-size: 0.9rem;">Obrigado por escolher o Kenji Restaurante Oriental.</p>
`;

document.getElementById('mensagemConfirmacao').innerHTML = msg;
});