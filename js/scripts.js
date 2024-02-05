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
let comboTipoRank = document.getElementById("tipoRank");
let ulObjeto = document.querySelector("#listaRank");
let itensCard = document.querySelector("#itensCard");
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let banner = document.querySelector("#banner");
let btnLogin = document.querySelector("#btnLogin");
let pontosH6 = document.querySelector("#pontosH6");
let nickH6 = document.querySelector("#nickH6");
let questBtn = document.querySelector("#questBtn");
let linkProfile = document.querySelector("#linkProfile");
let skills = document.querySelector("#skills");
let criaturas = document.querySelector("#criaturas");

let itens = [];

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const pegarTodosItens = async () => {
    await db.collection('itens').get().then(data =>{
        data.docs.forEach(element =>{
            const item = element.data();
            item.id = element.id;
            itens.push(item);
        });   
    });
}

const adicionarItemTroca = async (item, ponto, jogador) => {
    const itemTroca = {item, ponto, jogador}
    await db.collection('trocas').add(itemTroca);
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
}

const criarRankSkill = (opcaoSkill) => {
    jogadores = jogadores.sort((a, b) => {
        switch (opcaoSkill) {
            case "DF":
                if (a.defence > b.defence) {
                    return -1;
                }
                break;
            case "PL":
                if (a.distance > b.distance) {
                    return -1;
                }
                break;
            case "KN":
                if (a.melee > b.melee) {
                    return -1;
                }
                break;
            case "MG":
                if (a.magic > b.magic) {
                    return -1;
                }
                break;
        
            default:
                alert("Selecione uma opção válida");
                break;
        }
        
    });
}

const criarRankLevel = () => {
    jogadores = jogadores.sort((a, b) => {
        if (a.level > b.level) {
            return -1;
        }
    });
}

const criarRankQuiz = () => {
    jogadores = jogadores.sort((a, b) => {
        if (a.quiz > b.quiz) {
            return -1;
        }
    });
}

const criarRankX1 = () => {
    jogadores = jogadores.sort((a, b) => {
        if (a.pvp > b.pvp) {
            return -1;
        }
    });
}

const criarRankEscondeEsconde = () => {
    jogadores = jogadores.sort((a, b) => {
        if (a.escondeEsconde > b.escondeEsconde) {
            return -1;
        }
    });
}

comboTipoRank.addEventListener("change", function(event) {
    ulObjeto.innerHTML = '';
    let opcao = event.target.value;
    let skillBox = document.querySelector(".skillBox");
    let rankbox = document.querySelector(".rankbox");
    skillBox.style.display = opcao == "SK" ? 'block' : "none";

    switch (opcao) {
        case "SK":
            let tipoSkillBox = document.querySelector("#tipoSkill");
            tipoSkillBox.addEventListener("change", function(event) {
                let opcaoSkill = event.target.value;
                criarRankSkill(opcaoSkill);
                listarRank(opcaoSkill);
            });
            break;
        case "QZ":
            criarRankQuiz();
            break;
        case "X1":
            criarRankX1();
            break;
        case "EE":
            criarRankEscondeEsconde();
            break;
        case "LV":
            criarRankLevel();
            break;
        default:
            alert("Selecione uma opção válida");
            break;
    }
    listarRank(opcao);
    rankbox.style.display = 'flex';
});

const listarRank = (opcao) => {
    ulObjeto.innerHTML = '';

    switch (opcao) {
        case "DF":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.defence));
            });
            break;
        case "LV":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.level));
            });
            break;
        case "PL":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.distance));
            });
            break;
        case "KN":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.melee));
            });
            break;
        case "MG":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.magic));
            });
            break;
        case "QZ":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.quiz));
            });
            break;
        case "X1":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.pvp));
            });
            break;
        case "EE":
            jogadores.forEach(element => {
                ulObjeto.append(criarComponenteListaRank(element.nick, element.escondeEsconde));
            });
            break;
        default:
            break;
    }
}

const criarComponenteListaRank = (nick, valor) => {
    var liObjeto = document.createElement('li');
    var spanObjeto = document.createElement('span');

    liObjeto.className = "list-group-item d-flex justify-content-between align-items-center";
    liObjeto.innerText = nick;
    spanObjeto.style.backgroundColor = 'blue';
    spanObjeto.className = "badge badge-primary badge-pill";
    spanObjeto.innerText = valor;

    liObjeto.append(spanObjeto);
    return liObjeto;
}

const criarComponenteItem = (itemElement) => {
    var divColLg6 = document.createElement('div');
    var divCard = document.createElement('div');
    var divCardBody = document.createElement('div');
    var divFeature = document.createElement('div');
    var h2Pontos = document.createElement('h2');
    var pNome = document.createElement('p');
    var btnTrocaItem = document.createElement('button');
    var img = document.createElement('img');
    img.src = 'assets/img/' + itemElement.img;
    img.style.borderRadius = '15px';

    
    divColLg6.className = 'col-md-6 col-xxl-4 mb-5';
    divCard.className = 'card bg-light border-0 h-100';
    divCardBody.className = 'card-body text-center p-4 p-lg-5 pt-0 pt-lg-0';
    divFeature.className = 'feature bg-gradient text-white rounded-3 mb-4 mt-n4';
    h2Pontos.className = 'fs-4 fw-bold';

    h2Pontos.innerText = 'Pontos: ' + itemElement.ponto;
    pNome.innerText = itemElement.nome;
    btnTrocaItem.className = 'btn btn-primary';
    btnTrocaItem.innerText = 'Trocar';
    btnTrocaItem.addEventListener('click', () => {
        if(usuarioLogado == null) {
            Swal.fire({
                title: 'Falha ao realizar a troca',
                text: 'Faça o login antes de tentar efetuar uma troca.',
                icon: 'error',
                confirmButtonText: 'ok'
            });
        } else {
            trocarItem(itemElement.nome, itemElement.ponto);
        }
    });
    divFeature.append(img);
    divCardBody.append(divFeature);
    divCardBody.append(h2Pontos);
    divCardBody.append(pNome);
    divCardBody.append(btnTrocaItem);
    divCard.append(divCardBody);
    divColLg6.append(divCard);

    return divColLg6;
}

const trocarItem = async (item, pontoValor) => {

    if(pontoValor > usuarioLogado.pontos) {
        Swal.fire({
            title: 'Falha ao realizar a troca',
            text: 'Você não possui pontos o suficiente para realizar esta troca.',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        Swal.fire({
            title: "Deseja trocar seus pontos por este item?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Sim",
            denyButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) {
                adicionarItemTroca(item, pontoValor, usuarioLogado.nick);
                usuarioLogado.pontos = usuarioLogado.pontos - pontoValor;
                atualizarJogador(usuarioLogado);
                pontosH6.innerText = "Pontos: " + usuarioLogado.pontos;

                Swal.fire({
                    title: 'Troca efetuada com sucesso',
                    text: "Troca efetuada com sucessa, por favor avise o ADM.",
                    icon: 'success',
                    confirmButtonText: 'ok'
                });
            }
        });
    }
}

const efetuarLogin = () => {
    let nick = document.getElementById("nickInput").value;
    let senha = document.getElementById("senhaInput").value;
    
    if(nick == "" || senha == "") {
        alert("nick e senha são obrigatórios");
        Swal.fire({
            title: 'Falha no login',
            text: 'Usuário não encontrado.',
            icon: 'warning',
            confirmButtonText: 'ok'
        });
        
    } else {
        jogadores.forEach(element => {
            if(element.nick == nick && element.senha == senha) {
                usuarioLogado = element;
                window.localStorage.setItem("usuarioLogado", element.id);
            }
        });
        if(usuarioLogado == null) {
            Swal.fire({
                title: 'Falha no login',
                text: 'Usuário não encontrado.',
                icon: 'error',
                confirmButtonText: 'ok'
            });
        } else {
            btnLogin.style.display = 'none';
            questBtn.style.display = 'inline';
            preencherCampos();
            $('#modalLogin').modal('hide');
            Swal.fire({
                title: 'Login efetuado com sucesso',
                text: "Seja bem vindo(a) " + usuarioLogado.nick,
                icon: 'success',
                confirmButtonText: 'ok'
            });
            linkProfile.style.display = usuarioLogado != null ? 'block' : 'none';
            skills.style.display = 'inline';
        }    
    }
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
            btnLogin.style.display = 'none';
            preencherCampos();
            skills.style.display = 'inline';
        }
    } else {
        questBtn.style.display = 'none';
        skills.style.display = 'none';
    }
}

const preencherCampos = () => { 
    pontosH6.innerText = "Pontos: " + usuarioLogado.pontos;
    nickH6.innerText = usuarioLogado.nick;
}

const main = () => {  
    linkProfile.style.display = usuarioLogado != null ? 'block' : 'none';
    
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        criaturas.style.display = usuarioLogado != null && usuarioLogado.level >= 3 ? 'inline' : 'none';
    });
    pegarTodosItens().then(() => {
        itens.forEach(element => {
            itensCard.append(criarComponenteItem(element));
        });
    });
}

main();


