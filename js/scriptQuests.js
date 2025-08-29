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
let listaQuestsComponente = document.querySelector('#accordion');
let xpGuild = document.querySelector('#xpGuild');
let levelGuild = document.querySelector('#levelGuild');
let quests = [];
let pontosTotalTodasQuests = 0;
let totalPontosquestsPlayer = 0;
let xpGuildDivProgress = document.createElement('div');

const pegarTodasQuests = async () => {
    await db.collection('questsSemana').get().then(data => {
        data.docs.forEach(element => {
            const quest = element.data();
            quest.id = element.id;
            quests.push(quest);
        });
    });
}

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data => {
        data.docs.forEach(element => {
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const atualizarJogador = (id, usuario) => {
    db.collection("jogadores").doc(id).set(usuario);
}

const cadastrarJogadorLevelUp = async (usuario) => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    const levelUp = {
        usuario: usuario,
        dia: currentDate
    }
    await db.collection('levelUp').add(levelUp);
}

const criarComponenteListaQuest = (index, quest) => {
    let divCard = document.createElement('div');
    let divCardHeader = document.createElement('div');
    let h5Mb0 = document.createElement('h5');
    let btnTitulo = document.createElement('button');
    let h6Pontos = document.createElement('h6');
    let btnConcluir = document.createElement('button');
    let divCollapseDesc = document.createElement('div');
    let divCardBodyDesc = document.createElement('div');
    let divCardPontoBtn = document.createElement('div');
    divCardPontoBtn.style.display = 'flex';
    divCardHeader.className = 'card-header questCard';
    divCardHeader.setAttribute('id', 'heading' + index);
    divCard.className = 'card';
    divCard.style.margin = '5px';
    h5Mb0.className = 'mb-0';
    btnTitulo.className = 'btn btn-link collapsed';
    btnTitulo.setAttribute('data-toggle', 'collapse');
    btnTitulo.setAttribute('data-target', '#collapse' + index);
    btnTitulo.setAttribute('aria-expanded', 'false');
    btnTitulo.setAttribute('aria-controls', '#collapse' + index);
    btnTitulo.innerText = quest.nome;
    h6Pontos.className = 'pontosTexto';
    h6Pontos.style.marginRight = '15px';
    // h6Pontos.innerText = 'Pontos: ' + quest.ponto;
    h6Pontos.innerHTML = `<img src="../assets/icons/xp.png" alt="Pontos" style="width: 35px;vertical-align: middle;margin-right: 5px;"> ${quest.ponto}`;
    btnConcluir.style.width = '120px';
    if (verificarQuestConcluida(quest)) {
        btnConcluir.className = 'btn btn-danger';
        btnConcluir.innerText = 'Finalizada';
    } else {
        btnConcluir.className = 'btn btn-success';
        btnConcluir.innerText = 'Concluir';
        btnConcluir.addEventListener('click', () => {
            finalizarQuest(quest);
        });
    }
    divCollapseDesc.className = 'collapse';
    divCollapseDesc.setAttribute('id', 'collapse' + index);
    divCollapseDesc.setAttribute('aria-labelledby', '#heading' + index);
    divCollapseDesc.setAttribute('data-parent', '#accordion');
    divCardBodyDesc.className = 'card-body';
    divCardBodyDesc.innerText = quest.descricao;

    h5Mb0.append(btnTitulo);
    divCardHeader.append(h5Mb0);
    divCardPontoBtn.append(h6Pontos);
    divCardPontoBtn.append(btnConcluir);
    divCardHeader.append(divCardPontoBtn);

    divCollapseDesc.append(divCardBodyDesc);

    divCard.append(divCardHeader);
    divCard.append(divCollapseDesc);

    return divCard;
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

const finalizarQuest = (quest) => {
    Swal.fire({
        title: 'Você realmente vai finalizar esta quest?',
        text: "Analiza bem a descrição da quest e veja se realmente finalizou ela.",
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
            usuarioLogado.questsFinalizadas.push(quest);
            Swal.fire({
                title: 'Quest finalizada',
                text: "Quest Finalizada com sucesso! Agora avise o ADM para que ele aprove sua quest.",
                icon: 'success',
                confirmButtonText: 'ok'
            });
            usuarioLogado.totalPontosQuests = usuarioLogado.totalPontosQuests + quest.ponto;
            usuarioLogado.xpQuest = usuarioLogado.xpQuest + quest.ponto;
            if (usuarioLogado.questsFinalizadas.length == quests.length) {
                usuarioLogado.levelGuild++;
                levelGuild.innerText = levelGuild;
                // usuarioLogado.pontosAtributos = usuarioLogado.pontosAtributos + 5;
                Swal.fire({
                    title: 'Level Up!',
                    text: "Parabéns você passou de level! Avise o ADM para pegar os seus dimas.",
                    icon: 'success',
                    confirmButtonText: 'ok'
                });
                // if (usuarioLogado.levelGuild == 10) {
                //     usuarioLogado.pontosAtributos = 5;
                //     Swal.fire({
                //         title: "<strong>HTML <u>example</u></strong>",
                //         icon: "info",
                //         html: `
                //         Parabéns você chegou ao nivel 3!</b>Agora algumas funções novas foram liberadas para você.</br>
                //         Lista de funções desbloqueadas:
                //         <ol>
                //             <li><a href="https://sociedaderevolucionaria.netlify.app/profile">Gerenciar Quests</a></li>
                //             <li><a href="https://sociedaderevolucionaria.netlify.app/criaturas">Modo criatura</a></li>
                //         </ol></br>
                //         Acesse os links acima e veja o que há de novo.
                //         `
                //     });
                // } else if (usuarioLogado.levelGuild > 10) {
                //     usuarioLogado.pontosAtributos = usuarioLogado.pontosAtributos + 5;
                //     Swal.fire({
                //         title: 'Level Up!',
                //         text: "Parabéns você passou de level! Avise o ADM para pegar os seus dimas e lembre que ganhou pontos de atributos para suas criaturas.",
                //         icon: 'success',
                //         confirmButtonText: 'ok'
                //     });
                // } else {
                //     Swal.fire({
                //         title: 'Level Up!',
                //         text: "Parabéns você passou de level! Avise o ADM para pegar os seus dimas",
                //         icon: 'success',
                //         confirmButtonText: 'ok'
                //     });
                // }
                cadastrarJogadorLevelUp(usuarioLogado);
            }
            preencherCampos();
            listaQuestsComponente.innerHTML = '';
            listarTodasQuests();
            atualizarBarraProgressoLevel();
            atualizarJogador(usuarioLogado.id, usuarioLogado);
        }
    })
}

const verificarQuestConcluida = (questParam) => {
    let questFiltro = usuarioLogado.questsFinalizadas.filter((questCurrent) => questCurrent.id == questParam.id);
    return questFiltro.length > 0;
}

const preencherCampos = () => {
    totalPontosquestsPlayer = 0;
    if (usuarioLogado.questsFinalizadas.length > 0) {
        usuarioLogado.questsFinalizadas.forEach(element => {
            totalPontosquestsPlayer = totalPontosquestsPlayer + element.ponto;
        });
    }
    // pontosH6.innerText = "Pontos Quests: " + totalPontosquestsPlayer;
    pontosH6.innerHTML = `<img src="../assets/icons/xp.png" alt="Pontos" style="width: 35px;vertical-align: middle;margin-right: 5px;"> ${totalPontosquestsPlayer}`;
    levelGuild.innerText = usuarioLogado.levelGuild;
    nickH6.innerText = usuarioLogado.nick;
}

const porcentagemProgress = (questsPlayerPonto, pontosTodasQuests) => {
    return (100 * questsPlayerPonto) / pontosTodasQuests;
}

const listarTodasQuests = () => {
    pontosTotalTodasQuests = 0;
    quests.forEach((element, index) => {
        pontosTotalTodasQuests = pontosTotalTodasQuests + element.ponto;
        listaQuestsComponente.append(criarComponenteListaQuest(index, element));
    });
}

const atualizarBarraProgressoLevel = () => {
    var porcentagem = porcentagemProgress(totalPontosquestsPlayer, pontosTotalTodasQuests);
    xpGuild.innerHTML = '';
    xpGuildDivProgress.className = 'progress-bar bg-success';
    xpGuildDivProgress.setAttribute('role', 'progressbar');
    xpGuildDivProgress.style = 'width:' + porcentagem + '%';
    xpGuildDivProgress.innerText = porcentagem.toFixed(2);
    xpGuild.append(xpGuildDivProgress);
}

const main = () => {
    pegarTodosJogadores().then(() => {
        checarUsuarioLogado();
    });

    pegarTodasQuests().then(() => {
        preencherCampos();
        listarTodasQuests();
        atualizarBarraProgressoLevel();
    });
}

main();
