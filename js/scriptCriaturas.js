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

let criaturas = [];
let jogadores = [];
let criaturasLoja = document.querySelector('#criaturaPrincipal');
let suasCriaturas = document.querySelector('#suasCriaturas');
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let levelGuild = document.querySelector('#levelGuild');
let pontosH6 = document.querySelector("#pontosH6");
let pontosAtributos = document.querySelector("#pontosAtributos");
let suaCriaturaSessao = document.querySelector("#suaCriaturaSessao");
let nickH6 = document.querySelector("#nickH6");
let totalPontosquestsPlayer = 0;
let somarAttrSpan;
let subtrairAttrSpan;
let pontosAttrInicial;

const adicionarCriatura = async (nome, magia, defesa, ataque, img, ponto, level) => {
    const criaturaObj = {nome, magia, defesa, ataque, img, ponto, level}
    await db.collection('criaturas').add(criaturaObj);
}

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const pegarTodasCriaturas = async () => {
    await db.collection('criaturas').get().then(data =>{
        data.docs.forEach(element =>{
            const criatura = element.data();
            criatura.id = element.id;
            criaturas.push(criatura);
        });
    });
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
}

const listarCriaturas = () => {
    criaturasLoja.innerHTML = '';
    criaturas.forEach(element => {
        criaturasLoja.append(criarComponenteCriatura(element));
    });
}

const listarSuasCriaturas = () => {
    suasCriaturas.innerHTML = '';
    usuarioLogado.criaturas.forEach((element, index) => {
        suasCriaturas.append(criarComponenteSuasCriatura(element, index));
    });
}

const preencherAttrCriaturaPrincipal = () => {
    let ataqueCriaturaJogador = document.querySelector("#ataqueCriaturaJogador");
    let magiaCriaturaJogador = document.querySelector("#magiaCriaturaJogador");
    let defesaCriaturaJogador = document.querySelector("#defesaCriaturaJogador");
    let levelCriaturaJogador = document.querySelector("#levelCriaturaJogador");
    let nomeCriaturaJogador = document.querySelector("#nomeCriaturaJogador");
    let criaturaPrincipalImg = document.querySelector("#criaturaPrincipalImg");
    let vidaCriaturaJogador = document.querySelector("#vidaCriaturaJogador");
    ataqueCriaturaJogador.innerText = usuarioLogado.criaturas[0].ataque;
    magiaCriaturaJogador.innerText = usuarioLogado.criaturas[0].magia;
    defesaCriaturaJogador.innerText = usuarioLogado.criaturas[0].defesa;
    levelCriaturaJogador.innerText = usuarioLogado.criaturas[0].level;
    vidaCriaturaJogador.innerText = usuarioLogado.criaturas[0].vida;
    criaturaPrincipalImg.src = "assets/img/criaturas/" + usuarioLogado.criaturas[0].img;
    nomeCriaturaJogador.innerText = "Nome: " + usuarioLogado.criaturas[0].nome;
}

const clickBtnInfo = (criatura) => {
    let ataque = document.querySelector('#ataque');
    let magia = document.querySelector("#magia");
    let defesa = document.querySelector("#defesa");
    let level = document.querySelector("#level");
    let vida = document.querySelector("#vida");

    ataque.innerText = criatura.ataque;
    magia.innerText = criatura.magia;
    defesa.innerText = criatura.defesa;
    level.innerText = criatura.level;
    vida.innerText = criatura.vida;
    $('#modalAtributos').modal();
}

const clickBtnComprar = (criatura) => {
    Swal.fire({
        title: 'Você realmente deseja comprar o ' + criatura.nome + "?",
        showDenyButton: true,
        confirmButtonText: 'Sim',
        denyButtonText: 'Não',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            if(usuarioLogado.totalPontosQuests >= criatura.ponto) {
                const resultCriatura = usuarioLogado.criaturas.filter((criaturaFiltro) => criaturaFiltro.id == criatura.id);
                if(resultCriatura.length > 0) {
                    Swal.fire({
                        title: 'Falha ao comprar esta criatura',
                        text: 'Você já possue está criatura!',
                        icon: 'error',
                        confirmButtonText: 'ok'
                    });
                } else {
                    usuarioLogado.criaturas.push(criatura);
                    Swal.fire({
                        title: criatura.nome + 'comprada com sucesso',
                        icon: 'success',
                        confirmButtonText: 'ok'
                    });
                    usuarioLogado.totalPontosQuests = usuarioLogado.totalPontosQuests - criatura.ponto;
                    atualizarJogador(usuarioLogado);
                    listarSuasCriaturas();
                    listarCriaturas();
                    suaCriaturaSessao.style.display = 'block';
                    preencherAttrCriaturaPrincipal();
                    preencherCampos();
                }
            } else {
                Swal.fire({
                    title: 'Falha na compra',
                    text: 'Você não possue pontos o suficiente :( vá completar algumas quests!',
                    icon: 'error',
                    confirmButtonText: 'ok'
                });
            }
        } 
    })
}

const criarComponenteCriatura = (criatura) => {
    let divPrincipal = document.createElement('div');
    let divCard = document.createElement('div');
    let h6Pontos = document.createElement('h6');
    let h6Nome = document.createElement('h6');
    let img = document.createElement('img');
    let btnComprar = document.createElement('button');
    let btnBloqueado = document.createElement('button');
    let btnPopUp = document.createElement('button');
    btnPopUp.className = "btn btn-lg btn-dark btnPopUp";
    btnPopUp.addEventListener('click', () => {
        clickBtnInfo(criatura);
    });
    btnComprar.addEventListener('click', () => {
        clickBtnComprar(criatura);
    });
    btnPopUp.innerText = "Inf"
    divPrincipal.className = "col-md-3 criaturaPrincipal mt-3";
    divCard.className = "card";
    divCard.style.width = "15rem";
    h6Pontos.style.textAlign = "center";
    h6Pontos.innerText = "Pontos: " + criatura.ponto;
    h6Nome.style.textAlign = "center";
    h6Nome.innerText = criatura.nome;
    img.classList = "card-img-top";
    img.src = "assets/img/criaturas/" + criatura.img;
    btnComprar.style.display = usuarioLogado.levelGuild >= criatura.level ? 'inline': 'none';
    btnBloqueado.style.display = usuarioLogado.levelGuild < criatura.level ? 'inline': 'none';
    btnComprar.classList = "btn btn-dark m-1";
    btnComprar.innerText = "Comprar";
    btnBloqueado.classList = "btn btn-danger m-1";
    btnBloqueado.innerText = "Bloquedo " + "Lv: " + criatura.level;
    divCard.append(h6Pontos);
    divCard.append(h6Nome);
    divCard.append(btnPopUp);
    divCard.append(img);
    divCard.append(btnComprar);
    divCard.append(btnBloqueado);
    divPrincipal.append(divCard);
    return divPrincipal;
}

const selecionarCriatura = (criatura, index) => {
    let criaturaAtual = usuarioLogado.criaturas[0];
    usuarioLogado.criaturas[0] = criatura;
    usuarioLogado.criaturas[index] = criaturaAtual;
};
 

const criarComponenteSuasCriatura = (criatura, index) => {
    let divPrincipal = document.createElement('div');
    let divCard = document.createElement('div');
    let h6Nome = document.createElement('h6');
    let h6Level = document.createElement('h6');
    let img = document.createElement('img');
    let btnSelecionar = document.createElement('button');
    btnSelecionar.classList = "btn btn-dark m-1";
    btnSelecionar.innerText = "Selecionar";
    divPrincipal.className = "col-md-3 criaturaPrincipal mt-3";
    divCard.className = "card";
    divCard.style.width = "15rem";
    h6Nome.style.textAlign = "center";
    h6Nome.innerText = criatura.nome;
    h6Level.innerText = "Level: " + criatura.level;
    img.classList = "card-img-top";
    img.src = "assets/img/criaturas/" + criatura.img;
    btnSelecionar.addEventListener("click", () => {
        selecionarCriatura(criatura, index);
        preencherAttrCriaturaPrincipal();
        listarSuasCriaturas();
        atualizarJogador(usuarioLogado);
    });
    divCard.append(h6Nome);
    divCard.append(h6Nome);
    divCard.append(img);
    divCard.append(h6Level);
    divCard.append(btnSelecionar);
    divPrincipal.append(divCard);
    return divPrincipal;
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
        }
    } else {
        window.location = "https://sociedaderevolucionaria.netlify.app/";
    }
}

const verificarTemCriatura = () => {
    return usuarioLogado.criaturas != null && usuarioLogado.criaturas.length > 0;
}

const preencherCampos = () => {
    pontosH6.innerText = "Pontos Criaturas: " + usuarioLogado.totalPontosQuests;
    pontosAtributos.innerText = "Pontos Atributos: " + usuarioLogado.pontosAtributos;
    levelGuild.innerText = usuarioLogado.levelGuild;
    nickH6.innerText = usuarioLogado.nick;
}

const ordenarCriaturas = () => {
    criaturas = criaturas.sort((a, b) => {
        if (a.level < b.level) {
            return -1;
        }
    });
}

const somarAtributo = (idBtn, attr) => {
    let valor = 0;
    if(usuarioLogado.pontosAtributos == 0) {
        Swal.fire({
            title: 'Falha ao distribuir pontos!',
            text: 'Ops! Parece que você não tem pontos o suficiente para distribuir.',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        usuarioLogado.pontosAtributos--;
        if(attr == "vida") {
            usuarioLogado.criaturas[0].vida++;
            valor = usuarioLogado.criaturas[0].vida;
        } else if(attr == "ataque") {
            usuarioLogado.criaturas[0].ataque++;
            valor = usuarioLogado.criaturas[0].ataque;
        } else if(attr == "magia") {
            usuarioLogado.criaturas[0].magia++;
            valor = usuarioLogado.criaturas[0].magia;
        } else if(attr == "defesa") {
            usuarioLogado.criaturas[0].defesa++;
            valor = usuarioLogado.criaturas[0].defesa;
        } else {
            console.log('atributo não existe');
        }
        somarAttrSpan = document.querySelector('#' + idBtn);
        somarAttrSpan.innerText = valor;
        preencherCampos();
    }
}

const atualizarAtributo = () => {
    atualizarJogador(usuarioLogado);
    Swal.fire({
        title: 'Atributos atualizados com sucesso com sucesso!',
        icon: 'success',
        confirmButtonText: 'ok'
    });
}

const treinarCriatura = () => {
    let criaturaPrincipal = usuarioLogado.criaturas[0];
    let valorTotalStatusSuaCriatura = criaturaPrincipal.magia + criaturaPrincipal.ataque + criaturaPrincipal.defesa + criaturaPrincipal.vida;
    // valorTotalStatusSuaCriatura = Math.round(valorTotalStatusSuaCriatura * 1.5);

}

const subtrairAtributo = (idBtn, attr) => {
    let valor = 0;
    if(pontosAttrInicial <= usuarioLogado.pontosAtributos) {
        Swal.fire({
            title: 'Falha ao distribuir pontos!',
            text: 'Ops! Já devolveu todos os pontos, pode gastar eles agora.',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        usuarioLogado.pontosAtributos++;
        if(attr == "vida") {
            usuarioLogado.criaturas[0].vida--;
            valor = usuarioLogado.criaturas[0].vida;
        } else if(attr == "ataque") {
            usuarioLogado.criaturas[0].ataque--;
            valor = usuarioLogado.criaturas[0].ataque;
        } else if(attr == "magia") {
            usuarioLogado.criaturas[0].magia--;
            valor = usuarioLogado.criaturas[0].magia;
        } else if(attr == "defesa") {
            usuarioLogado.criaturas[0].defesa--;
            valor = usuarioLogado.criaturas[0].defesa;
        } else {
            console.log('atributo não existe');
        }
        somarAttrSpan = document.querySelector('#' + idBtn);
        somarAttrSpan.innerText = valor;
        preencherCampos();
    }
}

const main = () => {
    suaCriaturaSessao.style.display = 'none';
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        if(usuarioLogado == null || usuarioLogado.level < 3) {
            window.location = "https://sociedaderevolucionaria.netlify.app/";
        } else {
            pontosAttrInicial = usuarioLogado.pontosAtributos;
            preencherCampos();
            pegarTodasCriaturas().then(() => {
                ordenarCriaturas();
                listarCriaturas();
                listarSuasCriaturas();
                if(!verificarTemCriatura()) {
                    let apresentarMsg = window.localStorage.getItem("apresentarMsg");
                    debugger
                    if(apresentarMsg == null) {
                        Swal.fire({
                            icon: "info",
                            title: "Olá seja bem vindo a tela de criaturas.",
                            text: "Você ainda não possue nenhuma criatura, pois acabou de chegar ao level 3. Mas poderá compra sua primeira criatura, escolha uma das criaturas abaixo e compre ela!",
                        });
                        window.localStorage.setItem("apresentarMsg", true);
                    }
                    suaCriaturaSessao.style.display = 'none';
                    suasCriaturas.innerText = "Você não possue nenhuma criatura."
                } else {
                    suaCriaturaSessao.style.display = 'block';
                    preencherAttrCriaturaPrincipal();
                }
    
            });
        }
    });

}
main();
