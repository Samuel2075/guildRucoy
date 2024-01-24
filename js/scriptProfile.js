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


const main = () => {
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        criarGraficoSkill();
    });
    sessaoTrocas.style.display = usuarioLogado == 'kleCCPmgohdnhXJ7bLrg' || usuarioLogado == 'ivRrYp3VSS5yQ5gTZ0oU' ? 'block' : 'none'; 
    if(usuarioLogado == 'kleCCPmgohdnhXJ7bLrg' || usuarioLogado == 'ivRrYp3VSS5yQ5gTZ0oU') {
        pegarTodasTrocas().then(() => {
            preencherListaTrocas();
        });
    }
}

main();