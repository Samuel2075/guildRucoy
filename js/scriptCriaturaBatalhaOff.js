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
let usuarioLogado = window.localStorage.getItem("usuarioLogado");
let batalhaSessao = document.querySelector("#batalhaSessao");
let caraCoroaSessao = document.querySelector("#caraCoroaSessao");
const sectionBoardGame = document.getElementById('boardGame');
const botao = document.getElementById('jogar');
const resultado = document.getElementById('resultado');
const comboCaraCoroa = document.getElementById('comboCaraCoroa');
let btnCalcularDano = document.querySelector("#btnCalcularDano");
let btnCalcularIniciativa = document.querySelector("#btnCalcularIniciativa");
let btnCalcularDefesa = document.querySelector("#btnCalcularDefesa");
let criaturaInimiga = window.localStorage.getItem("inimigo");
let valorSuaCriatura = document.querySelector("#valorSuaCriatura");
let valorCriaturaInimiga = document.querySelector("#valorCriaturaInimiga");
const spanVidaInimigo = document.getElementById('spanVidaInimigo');
const spanVidaCriatura = document.getElementById('spanVidaCriatura');
let inimigoUsouMagia = false;
let suaCriatura;
let resultadoValorCriatura = 0;
let ladoEscolhido = '';
let seuTurno = false;
let dadosDano = [];
let htmlGeradoMsg = '';
const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data => {
        data.docs.forEach(element => {
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const checarUsuarioLogado = () => {
    if (usuarioLogado != null) {
        let jogadorFiltroLogado = jogadores.filter((jogador) => jogador.id == usuarioLogado);
        if (jogadorFiltroLogado.length == 0) {
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

function obtemLadoMoeda() {
    const numeroRandom = Math.round(Math.random() * 1);
    if (numeroRandom == 0) return 'cara';
    else return 'coroa';
}

const habilitarDesabilitarBotoes = () => {
    caraCoroaSessao.style.display = 'none';
    btnCalcularIniciativa.style.display = 'none';
    btnCalcularDefesa.style.display = !seuTurno ? 'inline' : 'none';
    btnCalcularDano.style.display = seuTurno ? 'inline' : 'none';
    batalhaSessao.style.display = 'block';
}

function giraMoeda() {
    if (comboCaraCoroa.value != 'cara' && comboCaraCoroa.value != 'coroa') {
        Swal.fire({
            title: 'Falha ao girar a moeda',
            text: 'Escolha um lado válido!',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        sectionBoardGame.classList.remove('animate-cara', 'animate-coroa');
        const ladoMoeda = obtemLadoMoeda();
        requestAnimationFrame(() =>
            sectionBoardGame.classList.add(`animate-${ladoMoeda}`)
        );
        zeraResultado();
        setTimeout(() => {
            geraResultado(ladoMoeda);
            if (comboCaraCoroa.value == ladoMoeda) {
                seuTurno = true;
                Swal.fire({
                    title: 'Você começa atacando.',
                    icon: 'info',
                    confirmButtonText: 'ok'
                });
            } else {
                seuTurno = false;
                Swal.fire({
                    title: 'Você começa defendendo.',
                    icon: 'info',
                    confirmButtonText: 'ok'
                });
            }
            habilitarDesabilitarBotoes();
        }, 3000);
    }
}

function geraResultado(lado) {
    resultado.innerHTML = `Deu ${lado}!`;
}

function utilizarMagia() {
    const valorSuaCriaturaMagia = calcularValorMagia();
    const valorInimigo = calcularValorInimigo();
    valorSuaCriatura.innerText = seuTurno ? "Dano sua criatura: " + valorSuaCriaturaMagia : "Defesa sua criatura: " + valorSuaCriaturaMagia;
    valorCriaturaInimiga.innerText = seuTurno ? "Defesa inimigo: " + valorInimigo : "Ataque inimigo: " + valorInimigo;
    for (let index = 0; index < dadosDano.length; index++) {
        htmlGeradoMsg = htmlGeradoMsg + dadosDano[index] + '/ ';
    }
    if (valorSuaCriaturaMagia > valorInimigo) {
        if (seuTurno) {
            criaturaInimiga.vida = criaturaInimiga.vida - valorSuaCriaturaMagia;
            atualizarVidaCriaturaInimigo();
        }

        Swal.fire({
            title: seuTurno ? "Ataque bem sucedido!" : "Defesa bem sucedida!",
            icon: "success",
            html: seuTurno ? "Parabéns seu ataque foi incrível. </br> Dados Gerados </br>" + htmlGeradoMsg : "Parabéns sua defesa foi incrível. </br> Dados Gerados </br>" + htmlGeradoMsg
        });
        
    } else {
        if (!seuTurno) {
            suaCriatura.vida = suaCriatura.vida - valorInimigo;
            atualizarVidaSuaCriatura();
        }
        Swal.fire({
            title: seuTurno ? "Ataque mal sucedido!" : "Defesa mal sucedida!",
            icon: "error",
            html: seuTurno ? "Ops! Parece que seu golpe não foi forte o suficiente. </br> Dados Gerados </br>" + htmlGeradoMsg : "Ops! Parece que sua defesa não resistiu. </br> Dados Gerados </br>" + htmlGeradoMsg
        });
    }
    
    if (verificarVitoria()) {
        Swal.fire({
            title: "Vitória!",
            icon: "success",
            text: "Parabéns você venceu."
        });
    } else if (verificarDerrota()) {
        Swal.fire({
            title: "Derrota!",
            icon: "error",
            text: "Ops!Você foi derrotado."
        });
    } else {
        seuTurno = !seuTurno;
        habilitarDesabilitarBotoes();
        btnCalcularMagia.style.display = 'none';
    }
}

function calcularValorMagia() {
    let somatorio = 0;
    let valor = 0;
    for (let index = 0; index < suaCriatura.magia; index++) {
        valor = seuTurno ? Math.round(Math.random() * suaCriatura.ataque) : Math.round(Math.random() * suaCriatura.defesa);
        somatorio = somatorio + valor;
        dadosDano.push(valor);
    }
    return somatorio;
}

function zeraResultado() {
    resultado.innerHTML = '';
}

function zeraResultado() {
    resultado.innerHTML = '';
}

botao.onclick = giraMoeda;

const calcularIniciativa = () => {
    caraCoroaSessao.style.display = 'flex';
    batalhaSessao.style.display = 'none';
    btnCalcularMagia.style.display = 'inline';
    botao.style.display = 'none';
}

const calcularDano = () => {
    const danoCriatura = Math.round(Math.random() * suaCriatura.ataque);
    const valorInimigoDefesa = calcularValorInimigo();
    valorSuaCriatura.innerText = "Dano sua criatura: " + danoCriatura;
    valorCriaturaInimiga.innerText = "Defesa inimigo: " + valorInimigoDefesa;
    if (danoCriatura > valorInimigoDefesa) {
        criaturaInimiga.vida = criaturaInimiga.vida - danoCriatura;
        atualizarVidaCriaturaInimigo();
        Swal.fire({
            title: "Ataque bem sucedido!",
            icon: "success",
            text: "Parabéns seu ataque foi incrível."
        });
    } else {
        Swal.fire({
            title: "Ataque mal sucedido!",
            icon: "error",
            text: "Ops! Parece que seu golpe não foi forte o suficiente."
        });
    }
    if (verificarVitoria()) {
        Swal.fire({
            title: "Vitória!",
            icon: "success",
            text: "Parabéns você venceu."
        });
    }
    seuTurno = !seuTurno;
    habilitarDesabilitarBotoes();
}

const verificarVitoria = () => {
    return criaturaInimiga.vida <= 0;
}

const verificarDerrota = () => {
    return suaCriatura.vida <= 0;
}

const atualizarVidaSuaCriatura = () => {
    spanVidaCriatura.innerText = suaCriatura.vida;
}

const atualizarVidaCriaturaInimigo = () => {
    spanVidaInimigo.innerText = criaturaInimiga.vida;
}


const calcularDefesa = () => {
    const defesaCriatura = Math.round(Math.random() * suaCriatura.defesa);
    const valorInimigoDano = calcularValorInimigo();
    valorSuaCriatura.innerText = "Defesa sua criatura: " + defesaCriatura;
    valorCriaturaInimiga.innerText = "Ataque inimigo: " + valorInimigoDano;

    if (defesaCriatura >= valorInimigoDano) {
        Swal.fire({
            title: "Defesa bem sucedida!",
            icon: "success",
            text: "Parabéns sua defesa foi incrível."
        });
    } else {
        Swal.fire({
            title: "Defesa falhou!",
            icon: "error",
            text: "Ops! Parece que sua defesa não resistiu."
        });
        suaCriatura.vida = suaCriatura.vida - valorInimigoDano;
        atualizarVidaSuaCriatura();
    }
    if (verificarDerrota()) {
        Swal.fire({
            title: "Derrota!",
            icon: "error",
            text: "Ops!Você foi derrotado."
        });
    }
    seuTurno = !seuTurno;
    habilitarDesabilitarBotoes();
}

const calcularValorInimigo = () => {
    let inimigoUsarMagia = Math.round(Math.random() * 1);
    let somatorio = 0;
    let valor = 0;
    
    if(inimigoUsarMagia == 1 && !inimigoUsouMagia) {
        for (let index = 0; index < criaturaInimiga.magia; index++) {
            valor = seuTurno ? Math.round(Math.random() * criaturaInimiga.ataque) : Math.round(Math.random() * criaturaInimiga.defesa);
            somatorio = somatorio + valor;
        }
        inimigoUsouMagia = !inimigoUsouMagia;
        return somatorio;
    } else {
        return seuTurno ? Math.round(Math.random() * criaturaInimiga.defesa) : Math.round(Math.random() * criaturaInimiga.ataque);
    }
}

comboCaraCoroa.addEventListener('change', () => {
    botao.style.display = 'block';
});

const preencherCamposCriaturas = () => {
    const spanLevelCriatura = document.getElementById('spanLevelCriatura');
    const spanAtaqueCriatura = document.getElementById('spanAtaqueCriatura');
    const spanMagiaCriatura = document.getElementById('spanMagiaCriatura');
    const spanDefesaCriatura = document.getElementById('spanDefesaCriatura');
    const imgCriatura = document.getElementById('imgCriatura');

    imgCriatura.src = "assets/img/criaturas/" + usuarioLogado.criaturas[0].img;
    spanLevelCriatura.innerText = usuarioLogado.criaturas[0].level;
    spanAtaqueCriatura.innerText = usuarioLogado.criaturas[0].ataque;
    spanMagiaCriatura.innerText = usuarioLogado.criaturas[0].magia;
    spanDefesaCriatura.innerText = usuarioLogado.criaturas[0].defesa;
    spanVidaCriatura.innerText = usuarioLogado.criaturas[0].vida;

}
const preencherCamposInimigos = () => {
    const spanLevelInimigo = document.getElementById('spanLevelInimigo');
    const spanAtaqueInimigo = document.getElementById('spanAtaqueInimigo');
    const spanMagiaInimigo = document.getElementById('spanMagiaInimigo');
    const spanDefesaInimigo = document.getElementById('spanDefesaInimigo');
    const imgCriaturaInimigo = document.getElementById('imgCriaturaInimigo');

    imgCriaturaInimigo.src = "assets/img/criaturas/" + criaturaInimiga.img;
    spanLevelInimigo.innerText = criaturaInimiga.level;
    spanAtaqueInimigo.innerText = criaturaInimiga.ataque;
    spanMagiaInimigo.innerText = criaturaInimiga.magia;
    spanDefesaInimigo.innerText = criaturaInimiga.defesa;
    spanVidaInimigo.innerText = criaturaInimiga.vida;
}

const main = () => {
    caraCoroaSessao.style.display = 'none';
    btnCalcularDano.style.display = 'none';
    btnCalcularDefesa.style.display = 'none';
    btnCalcularMagia.style.display = 'none';
    if (criaturaInimiga != null) {
        criaturaInimiga = JSON.parse(criaturaInimiga);
        pegarTodosJogadores().then(() => {
            checarUsuarioLogado();
            if (usuarioLogado == null || usuarioLogado.level < 3) {
                window.location = "https://sociedaderevolucionaria.netlify.app/";
            } else {
                suaCriatura = usuarioLogado.criaturas[0];
            }
            preencherCamposCriaturas();
            preencherCamposInimigos();
        });
    } else {
        // window.localStorage.setItem("inimigo", cria);
    }
}

main();

var card = document.querySelector('.card');
card.addEventListener( 'click', function() {
  card.classList.toggle('is-flipped');
});