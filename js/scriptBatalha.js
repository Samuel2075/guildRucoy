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
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let jogadores = [];
let jogadoresSelecionados = [];

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            player.selecionado = false;
            jogadores.push(player);
        });
    });
}

const adicionarSalaBatalha = async (jogador1, jogador2) => {
    const salaBatalhaObj = {jogador1, jogador2}
    await db.collection('salasBatalha').add(salaBatalhaObj);
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
}

const jogadorSelecionado = (jogador) => {
    let jogadorFiltro = jogadoresSelecionados.filter((jogadorFiltro) => jogadorFiltro.id == jogador.id);
    if(jogadorFiltro.length != 0) {
        jogadoresSelecionados.forEach((element, index) => {
            if(element.id == jogador.id) {
                jogadoresSelecionados.splice(index, 1);
            }
        });
    } else {
        jogadoresSelecionados.push(jogador);
    }
    jogador.selecionado = !jogador.selecionado;
}

const criarComponenteJogadoresCheck = (jogador) => {
    let formCheck = document.createElement('div');
    let formCheckInput = document.createElement('input');
    let formCheckLable = document.createElement('label');
    formCheck.className = "form-check";
    formCheckInput.className = "form-check-input";
    formCheckLable.className = "form-check-label";
    formCheckInput.setAttribute("type", "checkbox");
    formCheckInput.setAttribute("value", "");
    formCheckInput.setAttribute("id", "checkbox" + jogador.nick);
    formCheckInput.addEventListener('click', () => {
        jogadorSelecionado(jogador);
    });
    formCheckLable.setAttribute("for", "checkbox" + jogador.nick);
    formCheckLable.innerText = jogador.nick;
    formCheck.append(formCheckInput);
    formCheck.append(formCheckLable);
    return formCheck;
}

const iniciarBatalhas = () => {
    if(jogadoresSelecionados.length < 3) {
        Swal.fire({
            title: 'Falha ao iniciar evento!',
            text: 'Precisa de no mínimo 3 players',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        if(jogadoresSelecionados.length % 2 == 0) {
            console.log("par");
        } else {
            let randomIndex = Math.random() * (jogadoresSelecionados.length - 1);
            jogadoresSelecionados.push(jogadoresSelecionados[Math.round(randomIndex)]);
            gerarEquipes();
        }
    }
}

function shuffleArray(inputArray) {
    inputArray.sort(() => Math.random() - 0.5);
}

const gerarEquipes = () => {
    let novoArrayJogadores = [];
    let randomIndex = 0;

    while (jogadoresSelecionados.length > 0) {
        randomIndex = Math.random() * (jogadoresSelecionados.length - 1);
        novoArrayJogadores.push(jogadoresSelecionados[Math.round(randomIndex)]);
        jogadoresSelecionados.splice(Math.round(randomIndex), 1);
    }
    jogadoresSelecionados = separarJogadores(novoArrayJogadores);
}

const separarJogadores = (novoArrayJogadores) => {
    let jogador1 = {
        dano: 0,
        nick: '',
        criatura: {},
        id: ''
    };
    let jogador2 = {
        dano: 0,
        nick: '',
        criatura: {},
        id: ''
    };
    novoArrayJogadores.forEach((element, index) => {
        if(index == 0) {
            jogador1.id = element.id;
            jogador1.criatura = element.criaturas[0];
            jogador1.nick = element.nick;
        } else if(index == 1) {
            jogador2.id = element.id;
            jogador2.criatura = element.criaturas[0];
            jogador2.nick = element.nick;
            adicionarSalaBatalha(jogador1, jogador2);
        } else if(index % 2 == 0) {
            jogador1.id = element.id;
            jogador1.criatura = element.criaturas[0];
            jogador1.nick = element.nick;
        } else if(index % 2 != 0) {
            jogador2.id = element.id;
            jogador2.criatura = element.criaturas[0];
            jogador2.nick = element.nick;
            adicionarSalaBatalha(jogador1, jogador2);
        }
    });
}

const listarJogadores = () => {
    let checkJogadores = document.querySelector('#checkJogadores');
    checkJogadores.innerHTML = '';
    // criaturas
    jogadores.forEach((element) => {
        // element.criaturas = [];
        // element.xpQuest = element.totalPontosQuests;
        // element.pontosAtributos = 5;
        // atualizarJogador(element);
        if(element.criaturas.length > 0) {
            checkJogadores.append(criarComponenteJogadoresCheck(element));
        }
    });
}

const main = () => {
    pegarTodosJogadores().then(() => {
        listarJogadores();
    });
}

main();