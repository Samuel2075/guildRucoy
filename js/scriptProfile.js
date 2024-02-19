var firebaseConfig = {
    apiKey: "AIzaSyCB8zzeH9wk36FPlznwo7So-fTnzO0PlnA",
    authDomain: "sociedaderevolucionaria-6d7f1.firebaseapp.com",
    databaseURL: "https://sociedaderevolucionaria-6d7f1-default-rtdb.firebaseio.com",
    projectId: "sociedaderevolucionaria-6d7f1",
    storageBucket: "sociedaderevolucionaria-6d7f1.appspot.com",
    messagingSenderId: "373273056912",
    appId: "1:373273056912:web:19a88eefca66a1d5abea15",
    measurementId: "G-EZWYE3FGFY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let jogadores = [];
let quests = [];
let trocas = [];
let eventos = [];
let eventoVencedores = [];
let adms = [];
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let levelGuild = document.querySelector('#levelGuild');
let listaTrocas = document.querySelector('#listaTrocas');
let sessaoTrocas = document.querySelector('#sessaoTrocas');
let sessaoEventos = document.querySelector('#sessaoEventos');
let sessaoVencedores = document.querySelector('#sessaoVencedores');
let btnRegistrarColeta = document.querySelector("#btnRegistrarColeta");
let listaQuest = document.querySelector("#listaQuest");
let sessaoQuest = document.querySelector("#sessaoQuest");
let listaEventosVencedor = document.querySelector("#listaEventosVencedor");

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const pegarTodosAdms = async () => {
    await db.collection('adms').get().then(data =>{
        adms.push(data.docs[0].data().adms)
    });
}

const pegarTodasQuests = async () => {
    await db.collection('quests').get().then(data =>{
        data.docs.forEach(element =>{
            const quest = element.data();
            quest.id = element.id;
            quests.push(quest);
        });
    });
}

const pegarTodosEventos = async () => {
    eventos = [];
    await db.collection('eventos').get().then(data =>{
        data.docs.forEach(element =>{
            const evento = element.data();
            evento.id = element.id;
            eventos.push(evento);
        });
    });
}

const pegarTodosVencedoresEventos = async () => {
    eventoVencedores = [];
    await db.collection('eventoVencedores').get().then(data =>{
        data.docs.forEach(element =>{
            const eventoVencedor = element.data();
            eventoVencedor.id = element.id;
            eventoVencedores.push(eventoVencedor);
        });
    });
}

const pegarTodasTrocas = async () => {
    await db.collection('trocas').get().then(data =>{
        data.docs.forEach(element =>{
            const troca = element.data();
            troca.id = element.id;
            trocas.push(troca);
        });
    });
}

const adicionarQuest = async (nome, ponto, descricao) => {
    const questObj = {nome, ponto, descricao}
    await db.collection('quests').add(questObj);
}

const adicionarEvento = async (nome, ponto) => {
    const eventoObj = {nome, ponto}
    await db.collection('eventos').add(eventoObj);
}

const adicionarEventoVencedor = async (evento, jogador) => {
    const evntoVencedorObj = {evento, jogador}
    await db.collection('eventoVencedores').add(evntoVencedorObj);
}

const deletarTroca = async (itemTroca) => {
    let trocaFiltro = trocas.filter((troca) => troca.id == itemTroca.id);
    trocas.forEach((element, index) => {
        if(trocaFiltro[0].id == element.id) {
            trocas.splice(index, 1);
        }
    });
    db.collection("trocas").doc(itemTroca.id).delete();
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
}

const criarGraficoSkill = () => {
    const ctx = document.getElementById('graficoSkill');

    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Level', 'Melee', 'Dist', 'Magic', 'Defence'],
        datasets: [{
        label: 'Skills',
        data: [usuarioLogado.level, usuarioLogado.melee, usuarioLogado.distance, usuarioLogado.magic, usuarioLogado.defence],
        borderWidth: 1
        }]
    },
    options: {
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        }
      },
    });
}

const checarUsuarioLogado = () => {
    if(usuarioLogado != null) {
        let jogadorFiltroLogado = jogadores.filter((jogador) => jogador.id == usuarioLogado);
        if(jogadorFiltroLogado.length == 0) {
            Swal.fire({
                title: 'Falha recuperar usuário',
                text: 'Usuário logado não existe!',
                icon: 'error',
                confirmButtonText: 'ok'
            });
            localStorage.removeItem("usuarioLogado");
        } else {
            usuarioLogado = jogadorFiltroLogado[0];
            preencherCampos();
        }
    } else {
        window.location = "https://sociedaderevolucionaria.netlify.app/";
    }
}

const criarComponenteListaTroca = (itemTroca) => {
    let liLista = document.createElement('li');
    let btnItemEntregue = document.createElement('button');
    let stringNomeItem = itemTroca.item + "   /   " + itemTroca.jogador;
    liLista.className = "list-group-item liListaTroca";
    liLista.innerText = stringNomeItem;
    btnItemEntregue.innerText = "Entregue";
    btnItemEntregue.className = "btn btn-success";
    btnItemEntregue.addEventListener('click', () => {
        deletarTroca(itemTroca);
        preencherListaTrocas();
    });
    liLista.append(btnItemEntregue);
    return liLista;
}

const criarComponenteListaQuest = (questComponente) => {
    let liLista = document.createElement('li');
    let btnDeletarQuest = document.createElement('button');
    let stringNomeQuest = questComponente.nome + "   /   " + questComponente.descricao + "   /   " + questComponente.ponto + " Pontos";
    liLista.className = "list-group-item liListaTroca";
    liLista.innerText = stringNomeQuest;
    btnDeletarQuest.innerText = "Remover";
    btnDeletarQuest.className = "btn btn-danger";
    btnDeletarQuest.addEventListener('click', () => {
        deletarQuest(questComponente);
        listarQuests();
    });
    liLista.append(btnDeletarQuest);
    return liLista;
}

const deletarQuest = (questComponente) => {
    let questFiltro = quests.filter((quest) => quest.id == questComponente.id);
    quests.forEach((element, index) => {
        if(questFiltro[0].id == element.id) {
            quests.splice(index, 1);
        }
    });
    db.collection("quests").doc(questComponente.id).delete();
}

const preencherListaTrocas = () => {
    listaTrocas.innerHTML = '';
    trocas.forEach(element => {
        listaTrocas.append(criarComponenteListaTroca(element));
    });
}

const preencherCampos = () => {
    totalPontosquestsPlayer = 0;
    if(usuarioLogado.questsFinalizadas.length > 0) {
        usuarioLogado.questsFinalizadas.forEach(element => {
            totalPontosquestsPlayer = totalPontosquestsPlayer + element.ponto;
        });
    }
    levelGuild.innerText = usuarioLogado.levelGuild;
    nickH6.innerText = usuarioLogado.nick;
}

const criarComponenteListaContribuicao = (jogador) => {
    var liContribuicao = document.createElement('li');
    var spanContribuicao = document.createElement('span');
    liContribuicao.className = "list-group-item d-flex justify-content-between align-items-center";
    spanContribuicao.className = "badge badge-primary badge-pill";
    liContribuicao.innerText = jogador.nick;
    spanContribuicao.innerText = jogador.valorColeta.toLocaleString('pt-BR');
    spanContribuicao.style.backgroundColor = 'blue';
    liContribuicao.append(spanContribuicao);
    return liContribuicao;
}

const criarComponenteListaEventos = (evento) => {
    var liEvento = document.createElement('li');
    liEvento.className = "list-group-item d-flex justify-content-between align-items-center";
    liEvento.innerText = evento.nome + "  /  " + evento.ponto;
    return liEvento;
}

const criarComponenteListaEventosVencedores = (evento) => {
    var liEvento = document.createElement('li');
    liEvento.className = "list-group-item d-flex justify-content-between align-items-center";
    liEvento.innerText = evento.evento + "  /  " + evento.jogador;
    return liEvento;
}

const listarContribuicoes = () => {
    let listaContribuicao = document.querySelector("#listaContribuicao");
    listaContribuicao.innerHTML = '';
    jogadores.forEach(element => {
        if(element.valorColeta > 0) {
            listaContribuicao.append(criarComponenteListaContribuicao(element));
        }
    });
}

const listaEventos = () => {
    let listaEventos = document.querySelector("#listaEventos");
    listaEventos.innerHTML = '';
    eventos.forEach(element => {
        listaEventos.append(criarComponenteListaEventos(element));
    });
}

const listaEventosVencedores = () => {
    listaEventosVencedor.innerHTML = '';
    eventoVencedores.forEach(element => {
        listaEventosVencedor.append(criarComponenteListaEventosVencedores(element));
    });
}

const listarJogadorEventoVencedorSelect = () => {
    let jogadorEventoSelectVencedor = document.querySelector('#jogadorEventoSelectVencedor');
    jogadorEventoSelectVencedor.innerHTML = '';
    jogadores.forEach(element => {
        var optionSelect = document.createElement('option');
        optionSelect.value = element.id;
        optionSelect.innerHTML = element.nick;
        jogadorEventoSelectVencedor.appendChild(optionSelect);
    });
}

const listarEventosEventoVencedorSelect = () => {
    let eventoSelectVencedor = document.querySelector('#eventoSelectVencedor');
    eventoSelectVencedor.innerHTML = '';
    
    eventos.forEach(element => {
        var optionSelect = document.createElement('option');
        optionSelect.value = element.id;
        optionSelect.innerHTML = element.nome;
        eventoSelectVencedor.appendChild(optionSelect);
    });
}

const listarQuests = () => {
    listaQuest.innerHTML = '';
    quests.forEach(element => {
        listaQuest.append(criarComponenteListaQuest(element));
    });
}

const listarJogadoresSelectColeta = () => {
    let selectJogadoresModal = document.querySelector('#jogadorColetaSelect');
    
    jogadores.forEach(element => {
        var optionSelect = document.createElement('option');
        optionSelect.value = element.id;
        optionSelect.innerHTML = element.nick;
        selectJogadoresModal.appendChild(optionSelect);
    });
}

const salvarColeta = () => {
    let jogadorColetaSelect = document.querySelector('#jogadorColetaSelect');
    let valorInputColeta = document.querySelector('#valorInputColeta');
    
    const resultJogador = jogadores.filter((jogador) => jogador.id == jogadorColetaSelect.value);
    resultJogador[0].valorColeta = parseInt(resultJogador[0].valorColeta) + parseInt(valorInputColeta.value);
    atualizarJogador(resultJogador[0]);
    Swal.fire({
        title: 'Coleta atualizada com sucesso',
        icon: 'success',
        confirmButtonText: 'ok'
    });
    listarContribuicoes();
}

const registrarEventoVencedor = () => {
    $('#modalEventoVencedor').modal();
    listarJogadorEventoVencedorSelect();
    listarEventosEventoVencedorSelect();
}

const salvarEventoVencedor = () => {
    let eventoSelectVencedor = document.querySelector('#eventoSelectVencedor');
    let jogadorEventoSelectVencedor = document.querySelector('#jogadorEventoSelectVencedor');
    const resultEvento = eventos.filter((evento) => evento.id == eventoSelectVencedor.value);
    const resultJogador = jogadores.filter((jogador) => jogador.id == jogadorEventoSelectVencedor.value);
    
    if(resultEvento[0].nome == "Quiz") {
        resultJogador[0].quiz = resultJogador[0].quiz + resultEvento[0].ponto;
        Swal.fire({
            title: 'Vencedor registrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else if(resultEvento[0].nome == "Esconde-esconde") {
        resultJogador[0].escondeEsconde = resultJogador[0].escondeEsconde + resultEvento[0].ponto;
        Swal.fire({
            title: 'Vencedor registrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else if(resultEvento[0].nome == "Batalha de criaturas") {
        Swal.fire({
            title: 'Batalha',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else {
        Swal.fire({
            title: 'Em implementação',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    }
    adicionarEventoVencedor(resultEvento[0].nome, resultJogador[0].nick);
    atualizarJogador(resultJogador[0]);
    pegarTodosVencedoresEventos().then(() => {
        listaEventosVencedores();
    });
}

const salvarEvento = () => {
    let nomeInputPontoEvento = document.querySelector('#nomeInputPontoEvento');
    let valorInputPontoEvento = document.querySelector('#valorInputPontoEvento');    

    adicionarEvento(nomeInputPontoEvento.value, parseInt(valorInputPontoEvento.value));
    Swal.fire({
        title: 'Coleta atualizada com sucesso',
        icon: 'success',
        confirmButtonText: 'ok'
    });
    pegarTodosEventos().then(() => {
        listaEventos();
    });
}

btnRegistrarColeta.addEventListener('click', () => {
    listarJogadoresSelectColeta();
});

const cadastrarQuest = () => {
    let nomeQuest = document.querySelector("#nomeInputCadastroQuest");
    let pontosQuest = document.querySelector("#pontosInputCadastroQuest");
    let descricaoQuest = document.querySelector("#descricaoInputCadastroQuest");
    
    if(nomeQuest.value != "" && pontosQuest.value != "" && descricaoQuest.value != "") {
        quests = [];
        adicionarQuest(nomeQuest.value, parseInt(pontosQuest.value), descricaoQuest.value);
        pegarTodasQuests().then(() => {
            listarQuests();
        });
        Swal.fire({
            title: 'Quest cadastrada com sucesso',
            icon: 'success',
            confirmButtonText: 'ok'
        });
        nomeQuest.value = "";
        pontosQuest.value = "";
        descricaoQuest.value = "";
    } else {
        Swal.fire({
            title: 'Falha ao cadastrar a quest',
            text: 'Todos os campos são obrigatórios, favor preenche-los!',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    }
}

const registrarVencedor = () => {
    $('#modalEventoVencedor').modal();
}

const verificarPermissoes = () => {
    btnRegistrarColeta.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none'; 
    sessaoQuest.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none'; 
    sessaoTrocas.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoEventos.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none'; 
    sessaoVencedores.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none'; 
    if(usuarioLogado != null && adms[0].includes(usuarioLogado.id)) {
        pegarTodasTrocas().then(() => {
            preencherListaTrocas();
        });
    }
}

const main = () => {
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        criarGraficoSkill();
        listarContribuicoes();
    });

    pegarTodosAdms().then(() => {
        verificarPermissoes();
    });
    
    pegarTodasQuests().then(() => {
        listarQuests();
    });
    pegarTodosEventos().then(() => {
        listaEventos();
    });
    pegarTodosVencedoresEventos().then(() => {
        listaEventosVencedores();
    });
}

main();