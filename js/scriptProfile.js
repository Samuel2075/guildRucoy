(() => {
  'use strict';

  const self = this;

  // =========================
  // Boot / Ciclo de construção
  // =========================
  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  // =========================
  // Referências & Inicializações
  // =========================
  self.LoadReferences = () => {
    // ----- Firebase -----
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

    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    self.db = firebase.firestore();

    // ----- Estados -----
    self.jogadores = [];
    self.quests = [];
    self.trocas = [];
    self.eventos = [];
    self.eventoVencedores = [];
    self.adms = [];
    self.questsSemana = [];
    self.SellItems = [];
    self.elos = [];
    self.jogadoresQueAumentaramElo = [];

    // ----- Sessão / Usuário -----
    self.usuarioLogado = window.localStorage.getItem("usuarioLogado");

    // ----- DOM -----
    self.levelGuild = document.querySelector('#levelGuild');
    self.listaTrocas = document.querySelector('#listaTrocas');
    self.sessaoTrocas = document.querySelector('#sessaoTrocas');
    self.sessaoEventos = document.querySelector('#sessaoEventos');
    self.sessaoVencedores = document.querySelector('#sessaoVencedores');
    self.btnRegistrarColeta = document.querySelector("#btnRegistrarColeta");
    self.listaQuest = document.querySelector("#listaQuest");
    self.sessaoQuest = document.querySelector("#sessaoQuest");
    self.sessaoCadastrarJogador = document.querySelector("#sessaoCadastrarJogador");
    self.sessaoCadastroItem = document.querySelector("#sessaoCadastroItem");
    self.listaEventosVencedor = document.querySelector("#listaEventosVencedor");
    self.btnCalcularPontos = document.querySelector("#btnCalcularPontos");
    self.eloImg = document.querySelector("#eloImg");
    self.eloNome = document.querySelector("#eloNome");
    self.nickH6 = document.querySelector("#nickH6");

    // ----- Carregamentos iniciais (antes no main) -----
    self.LoadSellItems();
    self.pegarTodasQuestsSemanais();
    self.pegarTodosElos().then(() => {
      self.pegarTodosJogadores().then(() => {
        self.checarUsuarioLogado();
        self.pegarEloPeloId(self.usuarioLogado?.elo).then((elo) => {
          if (!elo) {
            console.warn("Elo não encontrado!");
          } else {
            if (self.eloImg) self.eloImg.src = `../assets/img/elos/${elo.imagem}`;
            if (self.eloNome) self.eloNome.innerText = elo.nome;
          }
        });
        self.criarGraficoSkill();
        self.listarContribuicoes();
      });

      self.pegarTodosAdms().then(() => {
        self.verificarPermissoes();
      });

      self.pegarTodasQuests().then(() => {
        self.listarQuests();
      });

      self.pegarTodosEventos().then(() => {
        self.listaEventos();
      });

      self.pegarTodosVencedoresEventos().then(() => {
        self.listaEventosVencedores();
      });
    });
  };

  // =========================
  // Eventos (somente listeners)
  // =========================
  self.LoadEvents = () => {
    if (self.btnRegistrarColeta) {
      self.btnRegistrarColeta.addEventListener('click', () => {
        self.listarJogadoresSelectColeta();
      });
    }
    // Adicione aqui outros listeners quando necessário.
  };

  // =========================
  // Funções (mantidas em PT-BR e fiéis ao original)
  // =========================

  self.pegarTodosJogadores = async () => {
    await self.db.collection('jogadores').get().then(data => {
      data.docs.forEach(element => {
        const player = element.data();
        player.id = element.id;
        self.jogadores.push(player);
      });
    });
  };

  self.adicionarJogador = async (defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests, criaturas, xpQuest, pontosAtributos, elo, totalAjuda) => {
    const player = { defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests, criaturas, xpQuest, pontosAtributos, elo, totalAjuda }
    await self.db.collection('jogadores').add(player);
  };

  self.adicionarQuestSemana = async (nome, descricao, ponto) => {
    const questObj = { nome, descricao, ponto }
    await self.db.collection('questsSemana').add(questObj);
  };

  self.adicionarItem = async (nome, ponto, img) => {
    const itemObj = { nome, ponto, img }
    await self.db.collection('itens').add(itemObj);
  };

  self.criarBkp = async (jogadores) => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    const bkp = {
      jogadores: jogadores,
      diaBKP: currentDate
    };
    await self.db.collection('bkp').add(bkp);
  };

  self.pegarTodosAdms = async () => {
    await self.db.collection('adms').get().then(data => {
      self.adms.push(data.docs[0].data().adms)
    });
  };

  self.pegarTodasQuests = async () => {
    await self.db.collection('quests').get().then(data => {
      data.docs.forEach(element => {
        const quest = element.data();
        quest.id = element.id;
        self.quests.push(quest);
      });
    });
  };

  self.pegarTodosEventos = async () => {
    self.eventos = [];
    await self.db.collection('eventos').get().then(data => {
      data.docs.forEach(element => {
        const evento = element.data();
        evento.id = element.id;
        self.eventos.push(evento);
      });
    });
  };

  self.pegarTodosVencedoresEventos = async () => {
    self.eventoVencedores = [];
    await self.db.collection('eventoVencedores').get().then(data => {
      data.docs.forEach(element => {
        const eventoVencedor = element.data();
        eventoVencedor.id = element.id;
        self.eventoVencedores.push(eventoVencedor);
      });
    });
  };

  self.deletarVencedorEvento = (vencedor) => {
    self.db.collection("eventoVencedores").doc(vencedor.id).delete()
  };

  self.pegarTodasTrocas = async () => {
    await self.db.collection('trocas').get().then(data => {
      data.docs.forEach(element => {
        const troca = element.data();
        troca.id = element.id;
        self.trocas.push(troca);
      });
    });
  };

  // Supondo: const db = firebase.firestore();
  self.adicionarQuest = async (nome, pontos, descricao) => {
    try {
      // Validações simples
      if (!nome || !descricao) throw new Error("Informe 'nome' e 'descricao'.");

      // Normalizações (Firestore não aceita undefined)
      const doc = {
        nome: String(nome).trim(),
        ponto: Number.isFinite(Number(pontos))
          ? Math.max(1, Math.min(3, Number(pontos))) // força 1–3
          : 1,
        descricao: String(descricao).trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const ref = await self.db.collection('quests').add(doc);
      console.log('Quest adicionada:', ref.id);
      return ref.id;
    } catch (err) {
      console.error('Erro ao adicionar quest:', err);
      alert(`Erro ao salvar quest: ${err.message}`);
      throw err;
    }
  };

  self.pegarTodosElos = async () => {
    self.elos = [];
    await self.db.collection('elos').get().then(data => {
      data.docs.forEach(element => {
        const elo = element.data();
        // elo.id = element.id;
        self.elos.push(elo);
      });
    });
  };

  self.pegarTodasQuestsSemanais = async () => {
    self.questsSemana = [];
    await self.db.collection('questsSemana').get().then(data => {
      data.docs.forEach(element => {
        const quest = element.data();
        quest.id = element.id;
        self.questsSemana.push(quest);
      });
    });
  };

  self.adicionarEvento = async (nome, ponto) => {
    const eventoObj = { nome, ponto }
    await self.db.collection('eventos').add(eventoObj);
  };

  self.adicionarVenda = async (item, fundo, preco, usuario) => {
    const itemVendaObj = { item, fundo, preco, usuario }
    await self.db.collection('itemsVenda').add(itemVendaObj);
  };

  self.adicionarEventoVencedor = async (evento, jogador) => {
    const evntoVencedorObj = { evento, jogador }
    await self.db.collection('eventoVencedores').add(evntoVencedorObj);
  };

  self.deletarTroca = async (itemTroca) => {
    let trocaFiltro = self.trocas.filter((troca) => troca.id == itemTroca.id);
    self.trocas.forEach((element, index) => {
      if (trocaFiltro[0].id == element.id) {
        self.trocas.splice(index, 1);
      }
    });
    await self.db.collection("trocas").doc(itemTroca.id).delete();
  };

  self.atualizarJogador = (usuario) => {
    self.db.collection("jogadores").doc(usuario.id).set(usuario)
  };

  self.deletarQuestSemana = (questSemana) => {
    self.db.collection("questsSemana").doc(questSemana.id).delete();
  };

  self.criarGraficoSkill = () => {
    const ctx = document.getElementById('graficoSkill');

    if (!ctx || !self.usuarioLogado || typeof self.usuarioLogado !== 'object') return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Level', 'Melee', 'Dist', 'Magic', 'Defence'],
        datasets: [{
          label: 'Skills',
          data: [
            self.usuarioLogado.level,
            self.usuarioLogado.melee,
            self.usuarioLogado.distance,
            self.usuarioLogado.magic,
            self.usuarioLogado.defence
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
  };

  self.pegarEloPeloId = async (id) => {
    const eloId = Number(id);

    const snap = await self.db
      .collection('elos')
      .where('id', '==', eloId)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    return { docId: doc.id, ...doc.data() };
  };

  self.checarUsuarioLogado = () => {
    if (self.usuarioLogado != null) {
      let jogadorFiltroLogado = self.jogadores.filter((jogador) => jogador.id == self.usuarioLogado);
      if (jogadorFiltroLogado.length == 0) {
        Swal.fire({
          title: 'Falha recuperar usuário',
          text: 'Usuário logado não existe!',
          icon: 'error',
          confirmButtonText: 'ok'
        });
        localStorage.removeItem("usuarioLogado");
      } else {
        self.usuarioLogado = jogadorFiltroLogado[0];
        self.preencherCampos();
      }
    } else {
      window.location = "https://sociedaderevolucionaria.netlify.app/";
    }
  };

  self.criarComponenteListaTroca = (itemTroca) => {
    let liLista = document.createElement('li');
    let btnItemEntregue = document.createElement('button');
    let stringNomeItem = itemTroca.item + "   /   " + itemTroca.jogador;
    liLista.className = "list-group-item liListaTroca";
    liLista.innerText = stringNomeItem;
    btnItemEntregue.innerText = "Entregue";
    btnItemEntregue.className = "btn btn-success";
    btnItemEntregue.addEventListener('click', async () => {
      await self.deletarTroca(itemTroca);
      self.preencherListaTrocas();
    });
    liLista.append(btnItemEntregue);
    return liLista;
  };

  self.criarComponenteListaQuest = (questComponente) => {
    let liLista = document.createElement('li');
    let btnDeletarQuest = document.createElement('button');
    let stringNomeQuest = questComponente.nome + "   /   " + questComponente.descricao + "   /   " + questComponente.ponto + " Pontos";
    liLista.className = "list-group-item liListaTroca";
    liLista.innerText = stringNomeQuest;
    btnDeletarQuest.innerText = "Remover";
    btnDeletarQuest.className = "btn btn-danger";
    btnDeletarQuest.addEventListener('click', () => {
      self.deletarQuest(questComponente);
      self.listarQuests();
    });
    liLista.append(btnDeletarQuest);
    return liLista;
  };

  self.deletarQuest = (questComponente) => {
    let questFiltro = self.quests.filter((quest) => quest.id == questComponente.id);
    self.quests.forEach((element, index) => {
      if (questFiltro[0].id == element.id) {
        self.quests.splice(index, 1);
      }
    });
    self.db.collection("quests").doc(questComponente.id).delete();
  };

  self.preencherListaTrocas = () => {
    if (!self.listaTrocas) return;
    self.listaTrocas.innerHTML = '';
    self.trocas.forEach(element => {
      self.listaTrocas.append(self.criarComponenteListaTroca(element));
    });
  };

  self.preencherCampos = () => {
    let totalPontosquestsPlayer = 0;
    if (self.usuarioLogado.questsFinalizadas.length > 0) {
      self.usuarioLogado.questsFinalizadas.forEach(element => {
        totalPontosquestsPlayer = totalPontosquestsPlayer + element.ponto;
      });
    }
    // self.levelGuild.innerText = self.usuarioLogado.levelGuild;
    if (self.nickH6) self.nickH6.innerText = self.usuarioLogado.nick;
  };

  self.criarComponenteListaContribuicao = (jogador) => {
    var liContribuicao = document.createElement('li');
    var spanContribuicao = document.createElement('span');
    liContribuicao.className = "list-group-item d-flex justify-content-between align-items-center";
    spanContribuicao.className = "badge badge-primary badge-pill";
    liContribuicao.innerText = jogador.nick;
    spanContribuicao.innerText = jogador.valorColeta.toLocaleString('pt-BR');
    spanContribuicao.style.backgroundColor = 'blue';
    liContribuicao.append(spanContribuicao);
    return liContribuicao;
  };

  self.criarComponenteListaEventos = (evento) => {
    var liEvento = document.createElement('li');
    liEvento.className = "list-group-item d-flex justify-content-between align-items-center";
    liEvento.innerText = evento.nome + "  /  " + evento.ponto;
    return liEvento;
  };

  self.criarComponenteListaEventosVencedores = (evento) => {
    var liEvento = document.createElement('li');
    liEvento.className = "list-group-item d-flex justify-content-between align-items-center";
    liEvento.innerText = evento.evento + "  /  " + evento.jogador;
    return liEvento;
  };

  self.listarContribuicoes = () => {
    let listaContribuicao = document.querySelector("#listaContribuicao");
    if (!listaContribuicao) return;
    listaContribuicao.innerHTML = '';
    self.jogadores.forEach(element => {
      if (element.valorColeta > 0) {
        listaContribuicao.append(self.criarComponenteListaContribuicao(element));
      }
    });
  };

  self.listaEventos = () => {
    let listaEventos = document.querySelector("#listaEventos");
    if (!listaEventos) return;
    listaEventos.innerHTML = '';
    self.eventos.forEach(element => {
      listaEventos.append(self.criarComponenteListaEventos(element));
    });
  };

  self.listaEventosVencedores = () => {
    if (!self.listaEventosVencedor) return;
    self.listaEventosVencedor.innerHTML = '';
    self.eventoVencedores.forEach(element => {
      self.listaEventosVencedor.append(self.criarComponenteListaEventosVencedores(element));
    });
  };

  self.listarJogadorEventoVencedorSelect = () => {
    let jogadorEventoSelectVencedor = document.querySelector('#jogadorEventoSelectVencedor');
    if (!jogadorEventoSelectVencedor) return;
    jogadorEventoSelectVencedor.innerHTML = '';
    self.jogadores.forEach(element => {
      var optionSelect = document.createElement('option');
      optionSelect.value = element.id;
      optionSelect.innerHTML = element.nick;
      jogadorEventoSelectVencedor.appendChild(optionSelect);
    });
  };

  self.listarEventosEventoVencedorSelect = () => {
    let eventoSelectVencedor = document.querySelector('#eventoSelectVencedor');
    if (!eventoSelectVencedor) return;
    eventoSelectVencedor.innerHTML = '';

    self.eventos.forEach(element => {
      var optionSelect = document.createElement('option');
      optionSelect.value = element.id;
      optionSelect.innerHTML = element.nome;
      eventoSelectVencedor.appendChild(optionSelect);
    });
  };

  self.listarQuests = () => {
    if (!self.listaQuest) return;
    self.listaQuest.innerHTML = '';
    self.quests.forEach(element => {
      self.listaQuest.append(self.criarComponenteListaQuest(element));
    });
  };

  self.listarJogadoresSelectColeta = () => {
    let selectJogadoresModal = document.querySelector('#jogadorColetaSelect');
    if (!selectJogadoresModal) return;

    selectJogadoresModal.innerHTML = '';
    self.jogadores.forEach(element => {
      var optionSelect = document.createElement('option');
      optionSelect.value = element.id;
      optionSelect.innerHTML = element.nick;
      selectJogadoresModal.appendChild(optionSelect);
    });
  };

  self.salvarColeta = () => {
    let jogadorColetaSelect = document.querySelector('#jogadorColetaSelect');
    let valorInputColeta = document.querySelector('#valorInputColeta');
    if (!jogadorColetaSelect || !valorInputColeta) return;

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

    if (count > 0) {
      valorColetaSomatorio = count * 1000 * valorColetaSomatorio;
    }

    const resultJogador = self.jogadores.filter((jogador) => jogador.id == jogadorColetaSelect.value);
    resultJogador[0].valorColeta = parseInt(resultJogador[0].valorColeta) + valorColetaSomatorio;
    self.atualizarJogador(resultJogador[0]);
    Swal.fire({
      title: 'Coleta atualizada com sucesso',
      icon: 'success',
      confirmButtonText: 'ok'
    });
    self.listarContribuicoes();
  };

  self.listarItensVenda = () => {
    let itemVenda = document.querySelector('#itemVendaSelect');
    if (!itemVenda) return;

    itemVenda.innerHTML = '';
    self.SellItems.forEach(element => {
      var optionSelect = document.createElement('option');
      optionSelect.value = element.nome;
      optionSelect.innerHTML = element.nome;
      itemVenda.appendChild(optionSelect);
    });
  };

  self.listarItensVendaFundo = () => {
    let itemVenda = document.querySelector('#fundoItemVenda');
    if (!itemVenda) return;

    itemVenda.innerHTML = '';
    let itensVendaSemRepeticao = [];
    self.SellItems.forEach(element => {
      if (itensVendaSemRepeticao.includes(element.Fundo) == false) {
        var optionSelect = document.createElement('option');
        optionSelect.value = element.Fundo;
        optionSelect.innerHTML = element.Fundo;
        itemVenda.appendChild(optionSelect);
        itensVendaSemRepeticao.push(element.Fundo);
      }
    });

    var optionSelectAzul = document.createElement('option');
    optionSelectAzul.value = "azul";
    optionSelectAzul.innerHTML = "azul";
    itemVenda.appendChild(optionSelectAzul);

    var optionSelectRoxo = document.createElement('option');
    optionSelectRoxo.value = "roxo";
    optionSelectRoxo.innerHTML = "roxo";
    itemVenda.appendChild(optionSelectRoxo);
  };

  self.registrarEventoVencedor = () => {
    $('#modalEventoVencedor').modal();
    self.listarJogadorEventoVencedorSelect();
    self.listarEventosEventoVencedorSelect();
  };

  // Corrigindo chamadas quebradas do original (mantendo intenção)
  self.ListarSellItems = () => self.listarItensVenda();
  self.ListarSellItemsFundo = () => self.listarItensVendaFundo();

  self.adicionarItemVenda = () => {
    $('#modalVendaItem').modal();
    self.ListarSellItems();
    self.ListarSellItemsFundo();
  };

  self.salvarVenda = () => {
    let precoItemVenda = document.querySelector('#precoItemVenda');
    let fundoItemVenda = document.querySelector('#fundoItemVenda');
    let itemVendaSelect = document.querySelector('#itemVendaSelect');

    if (!precoItemVenda || !fundoItemVenda || !itemVendaSelect) return;

    if (precoItemVenda.value == "") {
      Swal.fire({
        title: 'Falha ao cadastrar venda',
        text: 'Campo de preço é obrigatório!',
        icon: 'error',
        confirmButtonText: 'ok'
      });
    } else {
      self.adicionarVenda(itemVendaSelect.value, fundoItemVenda.value, precoItemVenda.value, self.usuarioLogado);
      Swal.fire({
        title: 'Venda cadastrada com sucesso com sucesso!',
        icon: 'success',
        confirmButtonText: 'ok'
      });
    }
  };

  self.salvarEventoVencedor = () => {
    let eventoSelectVencedor = document.querySelector('#eventoSelectVencedor');
    let jogadorEventoSelectVencedor = document.querySelector('#jogadorEventoSelectVencedor');
    if (!eventoSelectVencedor || !jogadorEventoSelectVencedor) return;

    const resultEvento = self.eventos.filter((evento) => evento.id == eventoSelectVencedor.value);
    const resultJogador = self.jogadores.filter((jogador) => jogador.id == jogadorEventoSelectVencedor.value);

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
    self.adicionarEventoVencedor(resultEvento[0].nome, resultJogador[0].nick);
    self.atualizarJogador(resultJogador[0]);
    self.pegarTodosVencedoresEventos().then(() => {
      self.listaEventosVencedores();
    });
  };

  self.salvarEvento = () => {
    let nomeInputPontoEvento = document.querySelector('#nomeInputPontoEvento');
    let valorInputPontoEvento = document.querySelector('#valorInputPontoEvento');
    if (!nomeInputPontoEvento || !valorInputPontoEvento) return;

    self.adicionarEvento(nomeInputPontoEvento.value, parseInt(valorInputPontoEvento.value));
    Swal.fire({
      title: 'Coleta atualizada com sucesso',
      icon: 'success',
      confirmButtonText: 'ok'
    });
    self.pegarTodosEventos().then(() => {
      self.listaEventos();
    });
  };

  self.cadastrarQuest = () => {
    let nomeQuest = document.querySelector("#nomeInputCadastroQuest");
    let pontosQuest = document.querySelector("#pontosInputCadastroQuest");
    let descricaoQuest = document.querySelector("#descricaoInputCadastroQuest");

    if (nomeQuest && pontosQuest && descricaoQuest && nomeQuest.value != "" && pontosQuest.value != "" && descricaoQuest.value != "") {
      self.quests = [];
      self.adicionarQuest(nomeQuest.value, parseInt(pontosQuest.value), descricaoQuest.value);
      self.pegarTodasQuests().then(() => {
        self.listarQuests();
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
  };

  self.registrarVencedor = () => {
    $('#modalEventoVencedor').modal();
  };

  self.calcularPontosQuests = (jogadorCorrente) => {
    let pontosTotais = 0;
    if (jogadorCorrente.questsFinalizadas.length > 0) {
      jogadorCorrente.questsFinalizadas.forEach(element => {
        pontosTotais = pontosTotais + element.ponto;
      });
    }
    return jogadorCorrente.questsFinalizadas.length > 0 ? Math.round(pontosTotais / 2) : 0;
  };

  self.totalPontosQuestsSemanaJogador = (jogadorCorrente) => {
    let pontosTotais = 0;
    if (jogadorCorrente.questsFinalizadas.length > 0) {
      jogadorCorrente.questsFinalizadas.forEach(element => {
        pontosTotais = pontosTotais + element.ponto;
      });
    }
    return jogadorCorrente.questsFinalizadas.length > 0 ? pontosTotais : 0;
  };

  self.shuffle = (v) => {
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
  };

  self.gerarQuestsSemana = () => {
    self.questsSemana.forEach(element => {
      self.deletarQuestSemana(element);
    });
    self.questsSemana = [];
    self.pegarTodasQuests().then(() => {
      const embaralharQuests = self.shuffle(self.quests);
      self.questsSemana.push(embaralharQuests[0]);
      self.questsSemana.push(embaralharQuests[1]);
      self.questsSemana.push(embaralharQuests[2]);
      self.questsSemana.push(embaralharQuests[3]);
      self.questsSemana.push(embaralharQuests[4]);
      self.questsSemana.push(embaralharQuests[5]);
      self.questsSemana.push(embaralharQuests[6]);
      self.questsSemana.push(embaralharQuests[7]);
      self.questsSemana.forEach(element => {
        self.adicionarQuestSemana(element.nome, element.descricao, element.ponto);
      });
    });
  };

  self.verificarJogadoresVencedoresEventos = () => {
    let jogadoresPontos = [];
    let jogadorObj = {};
    self.jogadores.forEach(element => {
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
  };

  self.calcularPontos = () => {
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
        let pontosQuestJogador = 0;
        self.criarBkp(self.jogadores);
        Swal.fire({
          title: 'Jogadores vencedores dos eventos!',
          text: self.verificarJogadoresVencedoresEventos(),
          icon: 'success',
          confirmButtonText: 'ok'
        });
        self.pegarTodosJogadores().then(async () => {
          const pontosTotaisQuests = (self.questsSemana || []).reduce((total, q) => total + (Number(q?.ponto) || 0), 0);
          self.jogadores.forEach(async (element) => {
            if (element.valorColeta >= 300000) {
              pontosSkill = 0;
              pontosSkill = (element.defence + element.distance + element.level + element.magic + element.melee) / 200;
              if (pontosSkill < 1) {
                pontosSkill = 1;
              }
              pontos = Math.round(pontosSkill);
              pontosQuestJogador = self.totalPontosQuestsSemanaJogador(element);
              element.pontos = (element.pontos + pontos) + (parseInt(element.valorColeta) / 100000) + self.calcularPontosQuests(element);
              pontosQuestJogador = pontosTotaisQuests;
              if (pontosQuestJogador == pontosTotaisQuests) {
                element.totalAjuda++;
                if (element.totalAjuda == 3) {
                  element.elo++;
                  element.totalAjuda = 0;
                  self.jogadoresQueAumentaramElo.push(element.id);
                }
              }
            }
            element.quiz = 0;
            element.escondeEsconde = 0;
            element.pvp = 0;
            element.questsFinalizadas = [];
            element.valorColeta = 0;
            element.totalPontosQuests = 0;
            self.atualizarJogador(element);
          });
          self.gerarQuestsSemana();
        });
        self.eventoVencedores.forEach(element => {
          self.deletarVencedorEvento(element);
        });
      }
    })
  };

  self.verificarPermissoes = () => {
    const isAdmin = self.usuarioLogado != null && self.adms[0] && self.adms[0].includes(self.usuarioLogado.id);
    if (self.btnRegistrarColeta) self.btnRegistrarColeta.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoQuest) self.sessaoQuest.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoTrocas) self.sessaoTrocas.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoEventos) self.sessaoEventos.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoVencedores) self.sessaoVencedores.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoCadastrarJogador) self.sessaoCadastrarJogador.style.display = isAdmin ? 'block' : 'none';
    if (self.sessaoCadastroItem) self.sessaoCadastroItem.style.display = isAdmin ? 'block' : 'none';
    if (self.btnCalcularPontos) self.btnCalcularPontos.style.display = isAdmin ? 'inline' : 'none';
    if (isAdmin) {
      self.pegarTodasTrocas().then(() => {
        self.preencherListaTrocas();
      });
    }
  };

  self.cadastrarJogador = () => {
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
      self.pegarTodosJogadores().then(() => {
        if (self.jogadores.filter(a => a.nick == nickCadastro).length > 0) {
          Swal.fire({
            title: 'Falha ao cadastrar o jogador',
            text: 'Este nick já existe!',
            icon: 'error',
            confirmButtonText: 'ok'
          });
        } else {
          // defence, distance, escondeEsconde, level, magic, melee, nick, pvp, quiz, pontos, senha, removerCache, valorColeta, questsFinalizadas, levelGuild, totalPontosQuests, pontosAtributos, elo, totalAjuda
          self.adicionarJogador(
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
            pontosAtributos,
            1,
            0);
          Swal.fire({
            title: 'Jogador cadastrado com sucesso',
            icon: 'success',
            confirmButtonText: 'ok'
          });
        }
      });

    }
  };

  self.cadastrarItem = () => {
    let nomeInputCadastroItem = document.querySelector("#nomeInputCadastroItem").value;
    let pontosInputCadastroItem = document.querySelector("#pontosInputCadastroItem").value;
    let linkDriveInputCadastroItem = document.querySelector("#linkDriveInputCadastroItem").value;

    if (nomeInputCadastroItem != "" && pontosInputCadastroItem != "" && linkDriveInputCadastroItem != "") {
      self.adicionarItem(nomeInputCadastroItem, parseInt(pontosInputCadastroItem), linkDriveInputCadastroItem);
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
  };

  // ----- Placeholders originais -----
  self.LoadReferencesLegacy = () => { };
  self.LoadSellItems = () => {
    fetch("./rucoy_itens_completo.json")
      .then(response => response.json())
      .then(json => {
        self.SellItems = json.itens;
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
  };
  self.LoadEventsLegacy = () => { };
  self.BuildLegacy = () => { };

  // Inicializa
  self.Build();
})();
