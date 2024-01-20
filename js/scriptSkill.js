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
const inputImage = document.querySelector('.input-image');
const btnAdcImage = document.querySelector('.btnAdcImagens');
const saidaTexto  = document.querySelector('.output-text');
const imagePreview = document.querySelector('.preview');
const barraProgresso = document.querySelector('.barraProgresso');
const btnAtualizarSkill = document.querySelector('.btnAtualizarSkill');
let pontosH6 = document.querySelector("#pontosH6");
let nickH6 = document.querySelector("#nickH6");

let splitValido = false;
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

function controlarProgresso(n){
    barraProgresso.style.width = `${n}%`; 
}

async function extrairTexto(img){
  const worker = Tesseract.createWorker({
    logger: function(m){
        controlarProgresso(m.progress * 100);
    }
  });
  
  await worker.load();
  await worker.loadLanguage('eng+por');
  await worker.initialize('eng+por');
  const { data: { text } } = await worker.recognize(img);
  const vetorSplit = text.split(':');
  console.log(vetorSplit);
  splitValido = vetorSplit.length == 6;
  if(vetorSplit.length == 6) {
    level = vetorSplit[1].substring(0, 4);
    melee = vetorSplit[2].substring(0, 4);
    dist = vetorSplit[3].substring(0, 4);
    magic = vetorSplit[4].substring(0, 4);
    defence = vetorSplit[5].substring(0, 4);
    if(isNaN(parseInt(level)) || isNaN(parseInt(melee)) || isNaN(parseInt(dist)) || isNaN(parseInt(magic)) || isNaN(parseInt(defence))) {
      splitValido = false;
    }
  }

  if(splitValido) {
    let stringCampoTexto = `Level: ${level}\nMelee: ${melee}\nDist: ${dist}\nMagic: ${magic}\nDef: ${defence}`;
    saidaTexto.value = stringCampoTexto;
  } else {
    Swal.fire({
        title: 'Falha ao adicionar a imagem',
        text: 'Esta imagem não está muito facil de reconhecer, tire outro print mais legivel por favor!',
        icon: 'error',
        confirmButtonText: 'ok'
    });
  }

   await worker.terminate();

}

btnAdcImage.addEventListener('click' , function(){
    inputImage.click();
})

const preencherCampos = () => { 
    pontosH6.innerText = "Pontos: " + usuarioLogado.pontos;
    nickH6.innerText = usuarioLogado.nick;
}

btnAtualizarSkill.addEventListener('click' , function(){
    if(splitValido) {
        usuarioLogado.level = parseInt(level);
        usuarioLogado.melee = parseInt(melee);
        usuarioLogado.distance = parseInt(dist);
        usuarioLogado.magic = parseInt(magic);
        usuarioLogado.defence = parseInt(defence);
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
})

inputImage.addEventListener('change' , function(){
    let fileImage = inputImage.files[0];

    imagePreview.src = URL.createObjectURL(fileImage);

    try{
      extrairTexto(fileImage);

    }catch(e){
        console.log('erro' , e);
    }

;})

const main = () => {  
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
        console.log(usuarioLogado);
    });
}

main();
