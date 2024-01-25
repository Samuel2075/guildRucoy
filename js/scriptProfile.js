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
let trocas = [];
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let levelGuild = document.querySelector('#levelGuild');
let listaTrocas = document.querySelector('#listaTrocas');
let sessaoTrocas = document.querySelector('#sessaoTrocas');
let btnRegistrarColeta = document.querySelector("#btnRegistrarColeta");

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
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
    }
}

const criarElementoListaTroca = (itemTroca) => {
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

const preencherListaTrocas = () => {
    listaTrocas.innerHTML = '';
    trocas.forEach(element => {
        listaTrocas.append(criarElementoListaTroca(element));
    });
}

const preencherCampos = () => {
    totalPontosquestsPlayer = 0;
    if(usuarioLogado.questsFinalizadas.length > 0) {
        usuarioLogado.questsFinalizadas.forEach(element => {
            totalPontosquestsPlayer = totalPontosquestsPlayer + element.ponto;
        });
    }
    pontosH6.innerText = "Pontos Quests: " + totalPontosquestsPlayer;
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

const listarContribuicoes = () => {
    let listaContribuicao = document.querySelector("#listaContribuicao");
    listaContribuicao.innerHTML = '';
    jogadores.forEach(element => {
        if(element.valorColeta > 0) {
            listaContribuicao.append(criarComponenteListaContribuicao(element));
        }
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
    debugger
    atualizarJogador(resultJogador[0]);
    Swal.fire({
        title: 'Coleta atualizada com sucesso',
        icon: 'success',
        confirmButtonText: 'ok'
    });
    listarContribuicoes();
}

btnRegistrarColeta.addEventListener('click', () => {
    listarJogadoresSelectColeta();
});

const main = () => {
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        btnRegistrarColeta.style.display = usuarioLogado.id == '05gmdpZkRWhckcMOZssB' || usuarioLogado.id == 'ivRrYp3VSS5yQ5gTZ0oU' ? 'block' : 'none'; 
        criarGraficoSkill();
        listarContribuicoes();
    });
    sessaoTrocas.style.display = usuarioLogado == 'kleCCPmgohdnhXJ7bLrg' || usuarioLogado == 'ivRrYp3VSS5yQ5gTZ0oU' ? 'block' : 'none'; 
    if(usuarioLogado == 'kleCCPmgohdnhXJ7bLrg' || usuarioLogado == 'ivRrYp3VSS5yQ5gTZ0oU') {
        pegarTodasTrocas().then(() => {
            preencherListaTrocas();
        });
    }
}

main();