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
let sessaoCadastrarJogador = document.querySelector("#sessaoCadastrarJogador");
let sessaoCadastroItem = document.querySelector("#sessaoCadastroItem");
let listaEventosVencedor = document.querySelector("#listaEventosVencedor");
let btnCalcularPontos = document.querySelector("#btnCalcularPontos");
let questsSemana = [];
let itensVenda = [];

const pegarTodosJogadores = async () => {
    await db.collection('jogadores').get().then(data => {
        data.docs.forEach(element => {
            const player = element.data();
            player.id = element.id;
            jogadores.push(player);
        });
    });
}

const adicionarJogador = async (defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests, criaturas, xpQuest, pontosAtributos) => {
    const player = { defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests, criaturas, xpQuest, pontosAtributos }
    await db.collection('jogadores').add(player);
}

const adicionarQuestSemana = async (nome, descricao, ponto) => {
    const questObj = { nome, descricao, ponto }
    await db.collection('questsSemana').add(questObj);
}

const adicionarItem = async (nome, ponto, img) => {
    const itemObj = { nome, ponto, img }
    await db.collection('itens').add(itemObj);
}

const criarBkp = async (jogadores) => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    const bkp = {
        jogadores: jogadores,
        diaBKP: currentDate
    };
    await db.collection('bkp').add(bkp);
}

const pegarTodosAdms = async () => {
    await db.collection('adms').get().then(data => {
        adms.push(data.docs[0].data().adms)
    });
}

const pegarTodasQuests = async () => {
    await db.collection('quests').get().then(data => {
        data.docs.forEach(element => {
            const quest = element.data();
            quest.id = element.id;
            quests.push(quest);
        });
    });
}

const pegarTodosEventos = async () => {
    eventos = [];
    await db.collection('eventos').get().then(data => {
        data.docs.forEach(element => {
            const evento = element.data();
            evento.id = element.id;
            eventos.push(evento);
        });
    });
}

const pegarTodosVencedoresEventos = async () => {
    eventoVencedores = [];
    await db.collection('eventoVencedores').get().then(data => {
        data.docs.forEach(element => {
            const eventoVencedor = element.data();
            eventoVencedor.id = element.id;
            eventoVencedores.push(eventoVencedor);
        });
    });
}

const deletarVencedorEvento = (vencedor) => {
    db.collection("eventoVencedores").doc(vencedor.id).delete()
}

const pegarTodasTrocas = async () => {
    await db.collection('trocas').get().then(data => {
        data.docs.forEach(element => {
            const troca = element.data();
            troca.id = element.id;
            trocas.push(troca);
        });
    });
}

// Supondo: const db = firebase.firestore();

const adicionarQuest = async (nome, pontos, descricao) => {
  try {
    // Validações simples
    if (!nome || !descricao) throw new Error("Informe 'nome' e 'descricao'.");

    // Normalizações (Firestore não aceita undefined)
    const doc = {
      nome: String(nome).trim(),
      pontos: Number.isFinite(Number(pontos))
        ? Math.max(1, Math.min(3, Number(pontos))) // força 1–3
        : 1,
      descricao: String(descricao).trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const ref = await db.collection('quests').add(doc);
    console.log('Quest adicionada:', ref.id);
    return ref.id;
  } catch (err) {
    console.error('Erro ao adicionar quest:', err);
    alert(`Erro ao salvar quest: ${err.message}`);
    throw err;
  }
};

const pegarTodasQuestsSemanais = async () => {
    questsSemana = [];
    await db.collection('questsSemana').get().then(data => {
        data.docs.forEach(element => {
            const quest = element.data();
            quest.id = element.id;
            questsSemana.push(quest);
        });
    });
}

const adicionarEvento = async (nome, ponto) => {
    const eventoObj = { nome, ponto }
    await db.collection('eventos').add(eventoObj);
}

const adicionarVenda = async (item, fundo, preco, usuario) => {
    const itemVendaObj = { item, fundo, preco, usuario }
    await db.collection('itemsVenda').add(itemVendaObj);
}

const adicionarEventoVencedor = async (evento, jogador) => {
    const evntoVencedorObj = { evento, jogador }
    await db.collection('eventoVencedores').add(evntoVencedorObj);
}

const deletarTroca = async (itemTroca) => {
    let trocaFiltro = trocas.filter((troca) => troca.id == itemTroca.id);
    trocas.forEach((element, index) => {
        if (trocaFiltro[0].id == element.id) {
            trocas.splice(index, 1);
        }
    });
    db.collection("trocas").doc(itemTroca.id).delete();
}

const atualizarJogador = (usuario) => {
    db.collection("jogadores").doc(usuario.id).set(usuario)
}

const deletarQuestSemana = (questSemana) => {
    db.collection("questsSemana").doc(questSemana.id).delete();
}

const criarGraficoSkill = () => {
    const ctx = document.getElementById('graficoSkill');

    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Level', 'Melee', 'Dist', 'Magic', 'Defence'],
        datasets: [{
            label: 'Skills',
            data: [
                usuarioLogado.level, 
                usuarioLogado.melee, 
                usuarioLogado.distance, 
                usuarioLogado.magic, 
                usuarioLogado.defence
            ],
            borderWidth: 1,
            backgroundColor: 'rgba(0, 123, 255, 0.5)' // cor das barras (opcional)
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
        },
        scales: {
            x: {
                ticks: {
                    color: "#fff" // letras brancas no eixo X
                },
                grid: {
                    color: "rgba(255,255,255,0.2)" // linhas da grade discretas
                }
            },
            y: {
                ticks: {
                    color: "#fff" // letras brancas no eixo Y
                },
                grid: {
                    color: "rgba(255,255,255,0.2)"
                }
            }
        }
    },
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
    let stringNomeQuest = questComponente.nome + "   /   " + questComponente.descricao + "   /   " + questComponente.pontos + " Pontos";
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
        if (questFiltro[0].id == element.id) {
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
    if (usuarioLogado.questsFinalizadas.length > 0) {
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
        if (element.valorColeta > 0) {
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
    const regex = /k/gi;
    let count = 0;
    let result;
    let valorColetaSomatorio = 0;
    valorColetaSomatorio = parseInt(valorInputColeta.value);
    
    while ((result = regex.exec(valorInputColeta.value)) !== null) {
        count++;
    }

    if (count > 3) {
        count = 3;    
    }
    
    if(count > 0) {
        valorColetaSomatorio = count * 1000 * valorColetaSomatorio;
    }

    const resultJogador = jogadores.filter((jogador) => jogador.id == jogadorColetaSelect.value);
    resultJogador[0].valorColeta = parseInt(resultJogador[0].valorColeta) + valorColetaSomatorio;
    atualizarJogador(resultJogador[0]);
    Swal.fire({
        title: 'Coleta atualizada com sucesso',
        icon: 'success',
        confirmButtonText: 'ok'
    });
    listarContribuicoes();
}

const listarItensVenda = () => {
    let itemVenda = document.querySelector('#itemVendaSelect');
    itemVenda.innerHTML = '';
    itensVenda.forEach(element => {
        var optionSelect = document.createElement('option');
        optionSelect.value = element.nome;
        optionSelect.innerHTML = element.nome;
        itemVenda.appendChild(optionSelect);
    });
}

const listarItensVendaFundo = () => {
    let itemVenda = document.querySelector('#fundoItemVenda');
    itemVenda.innerHTML = '';
    itensVendaSemRepeticao = [];
    itensVenda.forEach(element => {
        if(itensVendaSemRepeticao.includes(element.Fundo) == false) {
            var optionSelect = document.createElement('option');
            optionSelect.value = element.Fundo;
            optionSelect.innerHTML = element.Fundo;
            itemVenda.appendChild(optionSelect);
            itensVendaSemRepeticao.push(element.Fundo);
        }
    });

    var optionSelect = document.createElement('option');
    optionSelect.value = "azul";
    optionSelect.innerHTML = "azul";
    itemVenda.appendChild(optionSelect);
    itensVendaSemRepeticao.push("azul");

    optionSelect.value = "roxo";
    optionSelect.innerHTML = "roxo";
    itemVenda.appendChild(optionSelect);
    itensVendaSemRepeticao.push("roxo");
    
}

const registrarEventoVencedor = () => {
    $('#modalEventoVencedor').modal();
    listarJogadorEventoVencedorSelect();
    listarEventosEventoVencedorSelect();
}

const adicionarItemVenda = () => {
    $('#modalVendaItem').modal();
    listarItensVenda();
    listarItensVendaFundo();
}

const salvarVenda = () => {
    let precoItemVenda = document.querySelector('#precoItemVenda');
    let fundoItemVenda = document.querySelector('#fundoItemVenda');
    let itemVendaSelect = document.querySelector('#itemVendaSelect');

    if(precoItemVenda.value == "") {
        Swal.fire({
            title: 'Falha ao cadastrar venda',
            text: 'Campo de preço é obrigatório!',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        adicionarVenda(itemVendaSelect.value, fundoItemVenda.value, precoItemVenda.value, usuarioLogado);
        Swal.fire({
            title: 'Venda cadastrada com sucesso com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    }
    
    
}

const salvarEventoVencedor = () => {
    let eventoSelectVencedor = document.querySelector('#eventoSelectVencedor');
    let jogadorEventoSelectVencedor = document.querySelector('#jogadorEventoSelectVencedor');
    const resultEvento = eventos.filter((evento) => evento.id == eventoSelectVencedor.value);
    const resultJogador = jogadores.filter((jogador) => jogador.id == jogadorEventoSelectVencedor.value);

    if (resultEvento[0].nome == "Quiz") {
        resultJogador[0].quiz = resultJogador[0].quiz + resultEvento[0].ponto;
        Swal.fire({
            title: 'Vencedor registrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else if (resultEvento[0].nome == "Esconde-esconde") {
        resultJogador[0].escondeEsconde = resultJogador[0].escondeEsconde + resultEvento[0].ponto;
        Swal.fire({
            title: 'Vencedor registrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else if (resultEvento[0].nome == "Batalha de criaturas") {
        Swal.fire({
            title: 'Batalha',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else {
        Swal.fire({
            title: 'Vencedor registrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'ok'
        });
        resultJogador[0].pvp = resultJogador[0].pvp + resultEvento[0].ponto;
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

    if (nomeQuest.value != "" && pontosQuest.value != "" && descricaoQuest.value != "") {
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

// const criarComponenteListaQuestSemana = (quest) => {
//     var formDiv = document.createElement('div');
//     var inputFormCheck = document.createElement('input');
//     var labelFormCheck = document.createElement('label');
//     formDiv.className = 'form-check';
//     inputFormCheck.className = 'form-check-input';
//     labelFormCheck.className = 'form-check-label';
//     inputFormCheck.setAttribute('type', 'checkbox');
//     inputFormCheck.setAttribute('id', quest.id);
//     inputFormCheck.setAttribute('value', quest.id);
//     labelFormCheck.setAttribute('for', quest.id);
//     labelFormCheck.innerText = quest.nome;
//     formDiv.append(inputFormCheck);
//     formDiv.append(labelFormCheck);
//     return formDiv;
// }

const calcularPontosQuests = (jogadorCorrente) => {
    pontosTotais = 0;
    if (jogadorCorrente.questsFinalizadas.length > 0) {
        jogadorCorrente.questsFinalizadas.forEach(element => {
            pontosTotais = pontosTotais + element.ponto;
        });
    }
    return jogadorCorrente.questsFinalizadas.length > 0 ? Math.round(pontosTotais / 2) : 0;
}

const shuffle = (v) => {
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

const gerarQuestsSemana = () => {
    questsSemana.forEach(element => {
        deletarQuestSemana(element);
    });
    questsSemana = [];
    pegarTodasQuests().then(() => {
        const embaralharQuests = shuffle(quests);
        questsSemana.push(embaralharQuests[0]);
        questsSemana.push(embaralharQuests[1]);
        questsSemana.push(embaralharQuests[2]);
        questsSemana.push(embaralharQuests[3]);
        questsSemana.push(embaralharQuests[4]);
        questsSemana.push(embaralharQuests[5]);
        questsSemana.push(embaralharQuests[6]);
        questsSemana.push(embaralharQuests[7]);
        questsSemana.forEach(element => {
            adicionarQuestSemana(element.nome, element.descricao, element.ponto);
        });
    });
}

const verificarJogadoresVencedoresEventos = () => {
    let jogadoresPontos = [];
    let jogadorObj = {};
    jogadores.forEach(element => {
        jogadorObj = {
            nick: element.nick,
            totalPontos: element.pvp + element.escondeEsconde + element.quiz
        };
        jogadoresPontos.push(jogadorObj);
    });
    jogadoresPontos = jogadoresPontos.sort((a, b) => {
        if (a.totalPontos > b.totalPontos) {
            return -1;
        }
    });

    return '1º ' + jogadoresPontos[0].nick + ' / ' + '2º ' + jogadoresPontos[1].nick + ' / ' + '3º ' + jogadoresPontos[2].nick;
}

const calcularPontos = () => {
    Swal.fire({
        title: 'Deseja realmente recalcular todos os pontos?',
        text: "Verifique se todos os jogadores atualizaram suas skills para não ter nenhum problema.",
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
            let pontosSkill = 0;
            let pontos = 0;
            criarBkp(jogadores);
            Swal.fire({
                title: 'Jogadores vencedores dos eventos!',
                text: verificarJogadoresVencedoresEventos(),
                icon: 'success',
                confirmButtonText: 'ok'
            });
            pegarTodosJogadores().then(() => {
                jogadores.forEach(element => {
                    if (element.valorColeta >= 300000) {
                        pontosSkill = 0;
                        pontosSkill = (element.defence + element.distance + element.level + element.magic + element.melee) / 200;
                        if (pontosSkill < 1) {
                            pontosSkill = 1;
                        }
                        pontos = Math.round(pontosSkill);
                        element.pontos = (element.pontos + pontos) + (parseInt(element.valorColeta) / 100000) + calcularPontosQuests(element);
                    }
                    element.quiz = 0;
                    element.escondeEsconde = 0;
                    element.pvp = 0;
                    element.questsFinalizadas = [];
                    element.valorColeta = 0;
                    element.totalPontosQuests = 0;
                    atualizarJogador(element);
                });
                gerarQuestsSemana();
            });
            eventoVencedores.forEach(element => {
                deletarVencedorEvento(element);
            });
        }
    })
}

const verificarPermissoes = () => {
    btnRegistrarColeta.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoQuest.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoTrocas.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoEventos.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoVencedores.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoCadastrarJogador.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    sessaoCadastroItem.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'block' : 'none';
    btnCalcularPontos.style.display = usuarioLogado != null && adms[0].includes(usuarioLogado.id) ? 'inline' : 'none';
    if (usuarioLogado != null && adms[0].includes(usuarioLogado.id)) {
        pegarTodasTrocas().then(() => {
            preencherListaTrocas();
        });
    }
}

const cadastrarJogador = () => {
    let nickCadastro = document.querySelector("#nickInputCadastroJogador").value;
    let senhaCadastro = document.querySelector("#senhaInputCadastroJogador").value;
    let levelCadastro = document.querySelector("#levelInputCadastroJogador").value;
    let meleeCadastro = document.querySelector("#meleeInputCadastroJogador").value;
    let distanciaCadastro = document.querySelector("#distanciaInputCadastroJogador").value;
    let magiaCadastro = document.querySelector("#magiaInputCadastroJogador").value;
    let defesaCadastro = document.querySelector("#defesaInputCadastroJogador").value;
    let questsFinalizadas = [];
    let criaturas = [];
    let xpQuest = 0;
    let pontosAtributos = 0;

    if (nickCadastro === "" && senhaCadastro === "") {
        Swal.fire({
            title: 'Falha ao cadastrar o jogador',
            text: 'Todos os campos são obrigatórios, favor preenche-los!',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    } else {
        pegarTodosJogadores().then(() => {
            if(jogadores.filter(a => a.nick == nickCadastro).length > 0) {
                Swal.fire({
                    title: 'Falha ao cadastrar o jogador',
                    text: 'Este nick já existe!',
                    icon: 'error',
                    confirmButtonText: 'ok'
                });
            } else {
                // defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests
                adicionarJogador(
                    defesaCadastro === "" ? 0 : parseInt(defesaCadastro),
                    distanciaCadastro === "" ? 0 : parseInt(distanciaCadastro),
                    0,
                    levelCadastro === "" ? 0 : parseInt(levelCadastro),
                    magiaCadastro === "" ? 0 : parseInt(magiaCadastro),
                    meleeCadastro === "" ? 0 : parseInt(meleeCadastro),
                    nickCadastro,
                    0,
                    0,
                    1,
                    senhaCadastro,
                    false,
                    0,
                    questsFinalizadas,
                    1,
                    0,
                    criaturas,
                    xpQuest,
                    pontosAtributos);
                Swal.fire({
                    title: 'Jogador cadastrado com sucesso',
                    icon: 'success',
                    confirmButtonText: 'ok'
                });
            }
        });
        
    }
}

const cadastrarItem = () => {
    let nomeInputCadastroItem = document.querySelector("#nomeInputCadastroItem").value;
    let pontosInputCadastroItem = document.querySelector("#pontosInputCadastroItem").value;
    let linkDriveInputCadastroItem = document.querySelector("#linkDriveInputCadastroItem").value;

    if (nomeInputCadastroItem != "" && pontosInputCadastroItem != "" && linkDriveInputCadastroItem != "") {
        adicionarItem(nomeInputCadastroItem, parseInt(pontosInputCadastroItem), linkDriveInputCadastroItem);
        Swal.fire({
            title: 'Item cadastrado com sucesso',
            icon: 'success',
            confirmButtonText: 'ok'
        });
    } else {
        Swal.fire({
            title: 'Falha ao cadastrar item',
            text: 'Todos os campos são obrigatórios, favor preenche-los!',
            icon: 'error',
            confirmButtonText: 'ok'
        });
    }
}

const cadastrarItensVenda = () => {

    fetch("./rucoy_itens_completo.json")
      .then(response => response.json())
      .then(json => {
        itensVenda = json.itens;
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
}

const main = () => {
    cadastrarItensVenda();
    pegarTodasQuestsSemanais();

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