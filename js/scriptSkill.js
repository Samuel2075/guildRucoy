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
const inputImage = document.querySelector('#inputImage');
const btnAdcImage = document.querySelector('.btnAdcImagens');
// const saidaTexto  = document.querySelector('#textSkills');
const imagePreview = document.querySelector('.preview');
const barraProgresso = document.querySelector('.barraProgresso');
const btnAtualizarSkill = document.querySelector('.btnAtualizarSkill');
let pontosH6 = document.querySelector("#pontosH6");
let nickH6 = document.querySelector("#nickH6");
const levelInput  = document.querySelector('#levelInput');
const meleeInput  = document.querySelector('#meleeInput');
const distanciaInput  = document.querySelector('#distanciaInput');
const magiaInput  = document.querySelector('#magiaInput');
const defesaInput  = document.querySelector('#defesaInput');

let splitIsNaN = false;
let level; 
let melee; 
let dist; 
let magic;
let defence;

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data =>{
        data.docs.forEach(element =>{
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
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
        }  else {
            usuarioLogado = jogadorFiltroLogado[0];
            preencherCampos();
        }
    }
}

const preencherCampos = () => { 
    pontosH6.innerText = "Pontos: " + usuarioLogado.pontos;
    nickH6.innerText = usuarioLogado.nick;
}

const clickAtualizar = () => {
    if(levelInput.value != '' && meleeInput.value != '' && distanciaInput.value != '' && magiaInput.value != '' && defesaInput.value != '') {
    usuarioLogado.level = parseInt(levelInput.value);
    usuarioLogado.melee = parseInt(meleeInput.value);
    usuarioLogado.distance = parseInt(distanciaInput.value);
    usuarioLogado.magic = parseInt(magiaInput.value);
    usuarioLogado.defence = parseInt(defesaInput.value);
    atualizarJogador(usuarioLogado);
    Swal.fire({
        title: 'Skill atualizada com sucesso',
        icon: 'success',
        confirmButtonText: 'ok'
    });
} else {
    Swal.fire({
        title: 'Falha ao atualizar suas skills',
        text: 'Adicione uma imagem válida antes!',
        icon: 'error',
        confirmButtonText: 'ok'
    });
}
} 

inputImage.addEventListener('change' , function(){
    let fileImage = inputImage.files[0];
    imagePreview.src = URL.createObjectURL(fileImage);
    detectText();
;})

function detectarTexto1(text) {
    let vetorSplit = text.split(':');
    if(vetorSplit.length == 6) {
        level = parseInt(vetorSplit[1].substring(0, 4));
        melee = parseInt(vetorSplit[2].substring(0, 4));
        dist = parseInt(vetorSplit[3].substring(0, 4));
        magic = parseInt(vetorSplit[4].substring(0, 4));
        defence = parseInt(vetorSplit[5].substring(0, 4));
        if(isNaN(level)) {
            level = parseInt(vetorSplit[1].split(' ')[2].substring(0,3));
        }
        if(isNaN(melee)) {
            melee = parseInt(vetorSplit[1].split(' ')[2].substring(0,3));

        }
        if(isNaN(dist)) {
            dist = parseInt(vetorSplit[1].split(' ')[2].substring(0,3));

        }
        if(isNaN(defence)) {
            defence = parseInt(vetorSplit[1].split(' ')[2].substring(0,3));

        }
        if(isNaN(level)) {
            level = parseInt(vetorSplit[1].split(' ')[2].substring(0,3));
        }
        
    } else if(vetorSplit.length == 4){
        let splitElementArray = [];
        vetorSplit = text.split('\n');
        const filtrarVetor = vetorSplit.filter(function (str) { return str != '_' && str != ''; });
        let novoArray = [];
        vetorSplit = text.split('\n');
        filtrarVetor.forEach(element => {
            splitElementArray = element.split(' ');
            if(splitElementArray.length < 2) {
                splitElementArray = element.split('=');
            }
            novoArray.push(splitElementArray[1]);
        });
        novoArray = novoArray.filter(function( element ) {
            return element !== undefined;
        });
        level = parseInt(novoArray[0].substring(0, 4));
        melee = parseInt(novoArray[1].substring(0, 4));
        dist = parseInt(novoArray[2].substring(0, 4));
        magic = parseInt(novoArray[3].substring(0, 4));
        defence = parseInt(novoArray[4].substring(0, 4));
    } else if(vetorSplit.length == 5) {
        let splitElementArray = [];
        let novoArray = [];
        vetorSplit = text.split('\n');
        let filtrarVetor = vetorSplit.filter(function (str) { return str != '_' && str != ''; });
        filtrarVetor.forEach((element, index) => {
            splitElementArray = element.split(' ');
            filtrarVetor = splitElementArray.filter(function (str) { return str != '_' && str != '+';});
            if(element[0] != 'I' && element[0] != 'l') {
                if(isNaN(parseInt(filtrarVetor[1]))) {
                    novoArray.push(filtrarVetor[2]);
                } else {
                    novoArray.push(filtrarVetor[1]);
                }
            }
        });
        novoArray = novoArray.filter(function( element ) {
            return element !== undefined;
        });
        level = parseInt(novoArray[0].substring(0, 4));
        melee = parseInt(novoArray[1].substring(0, 4));
        dist = parseInt(novoArray[2].substring(0, 4));
        magic = parseInt(novoArray[3].substring(0, 4));
        defence = parseInt(novoArray[4].substring(0, 4));
    } else if(vetorSplit.length == 3) {
        let splitElementArray = [];
        let novoArray = [];
        vetorSplit = text.split('\n');
        let filtrarVetor = vetorSplit.filter(function (str) { return str != '_' && str != ''; });
        filtrarVetor.forEach((element, index) => {
            splitElementArray = element.split(' ');
            if(splitElementArray.length > 2) {
                splitElementArray = element.split('_');
                if(splitElementArray.length == 1 && splitElementArray[0].length > 4) {
                    if(element.split('=').length > 1) {
                        novoArray.push(element.split('=')[1].substring(1, 4));
                    } else {
                        if(splitElementArray[0].split(' ').length > 1) {
                            novoArray.push(splitElementArray[0].split(' ')[1]);
                        } else {
                            novoArray.push(splitElementArray[0]);
                        }
                    }
                } else {
                    novoArray.push(splitElementArray[1]);
                }
            } else {
                if(splitElementArray[0].length > 1) {
                    novoArray.push(splitElementArray[1]);
                }
            }
        });
        novoArray = novoArray.filter(function( element ) {
            return element !== undefined;
        });
        level = parseInt(novoArray[0].substring(0, 4));
        melee = parseInt(novoArray[1].substring(0, 4));
        dist = parseInt(novoArray[2].substring(0, 4));
        magic = parseInt(novoArray[3].substring(0, 4));
        defence = parseInt(novoArray[4].substring(0, 4));
    }
}

function detectarTexto2(text) {
    const vetorSplit = text.split('\n');
    if(vetorSplit.length == 15) {
        const filtrarVetor = vetorSplit.filter(function (str) { return str != '_' && str != ''; });
        let splitElementArray = [];
        let novoArray = [];
        filtrarVetor.forEach(element => {
            splitElementArray = element.split(':');
            if(splitElementArray.length < 2) {
                splitElementArray = element.split('=');
            }
            novoArray.push(splitElementArray[1]);
        });

        novoArray = novoArray.filter(function( element ) {
            return element !== undefined;
        });

        level = parseInt(novoArray[0].substring(0, 4));
        melee = parseInt(novoArray[1].substring(0, 4));
        dist = parseInt(novoArray[2].substring(0, 4));
        magic = parseInt(novoArray[3].substring(0, 4));
        defence = parseInt(novoArray[4].substring(0, 4));
    }
}

async function detectText() {
    const inputImage = document.getElementById('inputImage');
    const file = inputImage.files[0];

    
      const reader = new FileReader();

      reader.onload = async function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = async function() {

            const result = await Tesseract.recognize(
              img,
              'por',
              {
                logger: (info) => console.log(info), // opções, incluindo logger para depuração
                tessedit_char_whitelist: '0123456789', // Whitelist para dígitos (ajuste conforme necessário)
                threshold: 150 // Limiar de binarização (ajuste conforme necessário)
              }
            );

            detectarTexto1(result.text);
            levelInput.value = level;
            meleeInput.value = melee;
            distanciaInput.value = dist;
            magiaInput.value = magic;
            defesaInput.value = defence;
        };
      };

      reader.readAsDataURL(file);
    

  }

const main = () => {  
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
    });
}

main();
