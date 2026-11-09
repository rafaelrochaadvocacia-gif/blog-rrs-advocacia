async function () {
  // ==================================================================
  // REVISOR AUTOMÁTICO DE ARTIGOS DO BLOG RRS — roda no ExecuteWixAPI
  // ==================================================================
  // Como usar (rotinas agendadas): copie ESTE ARQUIVO INTEIRO como o
  // parâmetro `code` do ExecuteWixAPI (siteId 333aa652-3f67-4300-9a63-
  // f40b6407ce15) e preencha apenas o bloco CONFIG abaixo.
  //
  // Modos:
  //   "revisar"            -> confere o artigo e devolve o parecer
  //                           (APROVADO / APROVADO_COM_AVISOS / REPROVADO)
  //   "snapshot_rascunho"  -> devolve o texto do RASCUNHO em markdown
  //                           (salvar como revisoes/<slug>.rascunho.md)
  //   "snapshot_publicado" -> devolve o texto do POST PUBLICADO em markdown
  //                           (salvar como revisoes/<slug>.publicado.md)
  //
  // Regras de origem: diretrizes/guia-de-estilo-casa.md e
  // diretrizes/revisao-automatica.md (repositório blog-rrs-advocacia).
  // ==================================================================

  const CONFIG = {
    modo: "revisar",
    // "rascunho" lê /draft-posts/{id}; "publicado" lê /posts/{id}
    origem: "rascunho",
    postId: "COLE_AQUI_O_ID_DO_RASCUNHO",
    palavraChave: "COLE_AQUI_A_PALAVRA_CHAVE_EXATA",
    // "rafael" ou "fernanda"
    autor: "rafael",
    // I, II, III, IV, V, VI, VII ou VIII (campo FRENTE da pauta)
    frente: "II",
    // Opcional: caminho de página de serviço quando a frente não está no mapa
    paginaServicoExtra: "",
    // Toda lei, súmula, tema, portaria, edital, IN, resolução ou processo
    // citado no texto precisa estar aqui, com a URL OFICIAL onde foi conferido.
    fontes: [
      // {
      //   citacao: "Lei 13.988/2020",
      //   url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13988.htm"
      // }
    ]
  };

  const SITE = "https://www.rochaesantosadvocacia.com.br";
  const WHATSAPP = "https://wa.me/5532998169291?text=";
  const TAGLINE = "Escritório Rafael Rocha e Santos Advocacia. Seu Direito. Nossa Luta!";

  const AUTORES = {
    rafael: {
      nome: "Rafael Rocha",
      oab: "193.958"
    },
    fernanda: {
      nome: "Fernanda",
      oab: "199.347"
    }
  };

  const PAGINAS_SERVICO = {
    I: ["/isencao-de-ir"],
    II: ["/advogado-divida-ativa", "/regularizar-divida-ativa"],
    III: ["/advogado-execucao-fiscal"],
    IV: ["/advogado-bpc-loas"],
    V: ["/advogado-auxilio-acidente"],
    VI: ["/equiparacao-hospitalar-clinicas-medicas"],
    VII: ["/equiparacao-hospitalar-clinicas-odontologicas"],
    VIII: ["/advogada-divorcio-juiz-de-fora"]
  };

  // Expressões proibidas pela OAB (Provimento 205/2021) e pela lista negra
  // da skill artigos-juridicos-seo. Qualquer ocorrência REPROVA o artigo.
  const LISTA_NEGRA = [
    /garantimos/i,
    /garantia de (êxito|exito|sucesso|resultado|vitória|vitoria)/i,
    /resultado garantido/i,
    /sucesso garantido/i,
    /100\s?% de chance/i,
    /(você|voce) vai ganhar/i,
    /vamos ganhar/i,
    /causa ganha/i,
    /certeza de (vitória|vitoria|êxito|exito)/i,
    /o melhor (advogado|escritório|escritorio)/i,
    /imbat[ií]vel/i,
    /\b(em|na) promo[çc][ãa]o\b/i,
    /promo[çc][ãa]o (especial|imperd[ií]vel|exclusiva|rel[âa]mpago)/i,
    /oferta (imperdível|imperdivel|especial|por tempo)/i,
    /aproveite (agora|já|ja)/i,
    /consulta (gratuita|grátis|gratis)/i,
    /não perca essa chance/i,
    /você não vai acreditar/i,
    /o segredo que ninguém conta/i,
    /que os advogados escondem/i,
    /a receita não quer que você saiba/i,
    /ganhe dinheiro/i,
    /garanta (já )?(o )?seu direito/i,
    /tenha seu benefício aprovado/i,
    /pague quase nada/i
  ];

  // Erros de digitação já vistos em artigos publicados.
  const ERROS_CONHECIDOS = [
    /voc[çÇ]e/i,
    /vocÇe/,
    /\bbai (encontrar|ver)\b/i,
    /atendiento/i,
    /\b(de|da|do|das|dos|que|em|para|com|no|na) \1\b/
  ];

  const DOMINIOS_OFICIAIS = [
    /(^|\.)gov\.br$/,
    /(^|\.)jus\.br$/,
    /(^|\.)leg\.br$/,
    /(^|\.)mp\.br$/,
    /(^|\.)oab\.org\.br$/
  ];

  // ---------------------------------------------------------------- utils
  function sem_acentos(s) {
    return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function norm(s) {
    return sem_acentos(s)
      .toLowerCase()
      .replace(/[\u2010-\u2015-]/g, " ")
      .replace(/[^a-z0-9/ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function contem(texto, frase) {
    const t = " " + norm(texto) + " ";
    const f = " " + norm(frase) + " ";
    return f.trim().length > 0 && t.indexOf(f) >= 0;
  }

  function ocorrencias(texto, frase) {
    const t = " " + norm(texto) + " ";
    const f = " " + norm(frase) + " ";
    if (!f.trim()) return 0;
    let n = 0;
    let i = t.indexOf(f);
    while (i >= 0) {
      n += 1;
      i = t.indexOf(f, i + 1);
    }
    return n;
  }

  function textoDe(node) {
    if (!node) return "";
    if (node.type === "TEXT") return (node.textData && node.textData.text) || "";
    return (node.nodes || []).map(textoDe).join("");
  }

  function decoracoes(node) {
    const out = [];
    (function walk(n) {
      if (!n) return;
      if (n.type === "TEXT" && n.textData && n.textData.text.trim()) {
        out.push(n.textData.decorations || []);
      }
      (n.nodes || []).forEach(walk);
    })(node);
    return out;
  }

  function temDecoracao(node, tipo, teste) {
    const ds = decoracoes(node);
    if (!ds.length) return false;
    return ds.every(lista => lista.some(d => d.type === tipo && (!teste || teste(d))));
  }

  function links(node) {
    const out = [];
    (function walk(n) {
      if (!n) return;
      if (n.type === "TEXT") {
        for (const d of (n.textData && n.textData.decorations) || []) {
          if (d.type === "LINK" && d.linkData && d.linkData.link) {
            out.push({
              url: d.linkData.link.url || "",
              anchor: d.linkData.link.anchor || "",
              texto: n.textData.text
            });
          }
        }
      }
      (n.nodes || []).forEach(walk);
    })(node);
    return out;
  }

  function contarPalavras(s) {
    const m = (s || "").match(/[0-9A-Za-zÀ-ÿ]+(?:[-'.,][0-9A-Za-zÀ-ÿ]+)*/g);
    return m ? m.length : 0;
  }

  // Transforma os nós de topo numa lista linear de blocos de texto.
  function blocos(nodes) {
    const out = [];
    nodes.forEach((n, idx) => {
      const base = {
        idx: idx,
        type: n.type,
        node: n
      };
      if (n.type === "HEADING") {
        out.push(Object.assign(base, {
          level: n.headingData && n.headingData.level,
          text: textoDe(n).trim()
        }));
      } else if (n.type === "PARAGRAPH") {
        out.push(Object.assign(base, {
          text: textoDe(n).trim()
        }));
      } else if (n.type === "BULLETED_LIST" || n.type === "ORDERED_LIST") {
        (n.nodes || []).forEach(li => {
          out.push({
            idx: idx,
            type: "LIST_ITEM",
            node: li,
            text: textoDe(li).trim()
          });
        });
      } else if (n.type === "TABLE" || n.type === "COLLAPSIBLE_LIST" || n.type === "BLOCKQUOTE") {
        out.push(Object.assign(base, {
          text: textoDe(n).trim()
        }));
      } else {
        out.push(Object.assign(base, {
          text: ""
        }));
      }
    });
    return out;
  }

  // ------------------------------------------------- markdown (snapshot)
  function mdInline(nodes) {
    let out = "";
    for (const n of nodes || []) {
      if (n.type === "TEXT") {
        let t = n.textData.text;
        const ds = n.textData.decorations || [];
        const link = ds.find(d => d.type === "LINK");
        if (ds.some(d => d.type === "BOLD") && t.trim()) t = "**" + t + "**";
        if (ds.some(d => d.type === "ITALIC") && t.trim()) t = "_" + t + "_";
        if (link && link.linkData) t = "[" + t + "](" + (link.linkData.link.url || "") + ")";
        out += t;
      } else {
        out += mdInline(n.nodes);
      }
    }
    return out;
  }

  function mdBloco(n) {
    switch (n.type) {
      case "HEADING":
        return "#".repeat(n.headingData.level) + " " + textoDe(n).trim();
      case "PARAGRAPH":
        return mdInline(n.nodes).trim();
      case "BULLETED_LIST":
        return n.nodes.map(li => "- " + li.nodes.map(c => mdInline(c.nodes).trim()).join(" ")).join("\n");
      case "ORDERED_LIST":
        return n.nodes.map((li, i) => (i + 1) + ". " + li.nodes.map(c => mdInline(c.nodes).trim()).join(" ")).join("\n");
      case "TOC":
        return "[[SUMARIO]]";
      case "IMAGE":
        return "[[IMAGEM: " + ((n.imageData && n.imageData.altText) || "") + "]]";
      case "BUTTON":
        return "[[BOTAO: " + ((n.buttonData && n.buttonData.text) || "") + "]]";
      case "TABLE":
        return n.nodes.map(row => "| " + row.nodes.map(cell => textoDe(cell).trim()).join(" | ") + " |").join("\n");
      default:
        return textoDe(n).trim();
    }
  }

  function markdown(titulo, nodes) {
    const partes = ["# " + titulo];
    for (const n of nodes) {
      const b = mdBloco(n);
      if (b) partes.push(b);
    }
    return partes.join("\n\n");
  }

  // ----------------------------------------------------------- citações
  function anoCompleto(a) {
    if (!a) return "";
    if (a.length === 2) return (parseInt(a, 10) > 40 ? "19" : "20") + a;
    return a;
  }

  function numero(s) {
    return (s || "").replace(/\./g, "");
  }

  function extrairCitacoes(texto) {
    const achadas = new Map();
    function add(chave, trecho) {
      if (!achadas.has(chave)) achadas.set(chave, trecho.trim());
    }
    let m;
    const reLei = /\bLei(\s+Complementar)?(?:\s+(?:Federal|Estadual|Municipal))?\s+(?:n[º°o.]\s*)?(\d{1,2}\.\d{3}|\d{1,5})\s*\/\s*(\d{4}|\d{2})\b/giu;
    while ((m = reLei.exec(texto))) {
      add((m[1] ? "lc " : "lei ") + numero(m[2]) + "/" + anoCompleto(m[3]), m[0]);
    }
    const reSumula = /\bS[úu]mula(\s+Vinculante)?\s+(?:n[º°o.]\s*)?(\d{1,4})(?:\s*(?:\/|do|da)\s*(STJ|STF|TNU|TST|CARF|TRF\d?))?/giu;
    while ((m = reSumula.exec(texto))) {
      add("sumula " + (m[1] ? "vinculante " : "") + m[2] + (m[3] ? " " + m[3].toLowerCase() : ""), m[0]);
    }
    const reTema = /\bTema(?:\s+(?:Repetitivo|de\s+Repercuss[ãa]o\s+Geral))?\s+(?:n[º°o.]\s*)?(\d{1,2}\.\d{3}|\d{1,4})\b/giu;
    while ((m = reTema.exec(texto))) {
      add("tema " + numero(m[1]), m[0]);
    }
    const reAto = /\b(Portaria|Instru[çc][ãa]o Normativa|Resolu[çc][ãa]o|Edital|Decreto|Provimento|Solu[çc][ãa]o de Consulta|Nota T[ée]cnica|Medida Provis[óo]ria|Emenda Constitucional)\b[^.;:()\n\d]{0,40}?(?:n[º°o.]\s*)?(\d{1,3}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b/giu;
    while ((m = reAto.exec(texto))) {
      add(norm(m[1]).replace(/ /g, "_") + " " + numero(m[2]) + "/" + anoCompleto(m[3]), m[0]);
    }
    const reSigla = /\b(IN|RDC|EC|MP)\s+(?:[A-Z]{2,6}\s+)?(?:n[º°o.]\s*)?(\d{1,3}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b/gu;
    while ((m = reSigla.exec(texto))) {
      const tipos = {
        IN: "instrucao_normativa",
        RDC: "rdc",
        EC: "emenda_constitucional",
        MP: "medida_provisoria"
      };
      add(tipos[m[1]] + " " + numero(m[2]) + "/" + anoCompleto(m[3]), m[0]);
    }
    const reProc = /\b(REsp|AREsp|RE|ARE|ADI|ADC|ADPF|RMS|AgInt)\s+(?:n[º°o.]\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,})/gu;
    while ((m = reProc.exec(texto))) {
      add(m[1].toLowerCase() + " " + numero(m[2]), m[0]);
    }
    return achadas;
  }

  function citacaoCoberta(chave, chavesFontes) {
    if (chavesFontes.has(chave)) return true;
    if (chave.indexOf("sumula") === 0) {
      const semTribunal = chave.replace(/ (stj|stf|tnu|tst|carf|trf\d?)$/, "");
      for (const f of chavesFontes) {
        if (f.replace(/ (stj|stf|tnu|tst|carf|trf\d?)$/, "") === semTribunal) return true;
      }
    }
    if (chave.indexOf("instrucao_normativa") === 0) {
      for (const f of chavesFontes) {
        if (f.replace(/^in /, "instrucao_normativa ") === chave) return true;
      }
    }
    return false;
  }

  function dominio(url) {
    const m = /^https?:\/\/([^/?#]+)/i.exec(url || "");
    return m ? m[1].toLowerCase().replace(/^www\./, "") : "";
  }

  // ------------------------------------------------------------- busca
  async function buscar() {
    if (CONFIG.origem === "publicado" || CONFIG.modo === "snapshot_publicado") {
      let r;
      try {
        r = await wix.request({
          method: "GET",
          url: "https://www.wixapis.com/blog/v3/posts/" + CONFIG.postId + "?fieldsets=RICH_CONTENT&fieldsets=SEO"
        });
      } catch (e) {
        // 404 = o post ainda não está no ar (continua rascunho ou foi despublicado)
        return null;
      }
      const p = (r.data || r).post;
      if (!p) return null;
      return {
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        slug: p.slug,
        status: "PUBLISHED",
        seoData: p.seoData,
        media: p.media,
        richContent: p.richContent
      };
    }
    const r = await wix.request({
      method: "GET",
      url: "https://www.wixapis.com/blog/v3/draft-posts/" + CONFIG.postId + "?fieldsets=RICH_CONTENT"
    });
    const d = (r.data || r).draftPost;
    return {
      id: d.id,
      title: d.title,
      excerpt: d.excerpt,
      slug: d.seoSlug,
      status: d.status,
      seoData: d.seoData,
      media: d.media,
      richContent: d.richContent
    };
  }

  // ------------------------------------------------------------- revisão
  function revisar(post) {
    const nodes = (post.richContent && post.richContent.nodes) || [];
    const bl = blocos(nodes);
    const naoVazios = bl.filter(b => b.text || ["TOC", "IMAGE", "BUTTON", "TABLE"].indexOf(b.type) >= 0);
    const resultados = [];
    function check(id, nivel, ok, descricao, detalhe) {
      resultados.push({
        id: id,
        nivel: nivel,
        ok: !!ok,
        descricao: descricao,
        detalhe: ok ? "" : (detalhe || "")
      });
    }

    const autor = AUTORES[CONFIG.autor];
    const kw = CONFIG.palavraChave;
    const h2 = bl.filter(b => b.type === "HEADING" && b.level === 2);
    const h3 = bl.filter(b => b.type === "HEADING" && b.level === 3);
    const textoCorpo = bl.map(b => b.text).filter(Boolean).join("\n");
    const textoCompleto = post.title + "\n" + textoCorpo;
    const palavras = contarPalavras(textoCorpo);

    // seção de cada H2 = blocos até o próximo H2
    function secao(h) {
      const i = bl.indexOf(h);
      const out = [];
      for (let j = i + 1; j < bl.length; j++) {
        if (bl[j].type === "HEADING" && bl[j].level === 2) break;
        out.push(bl[j]);
      }
      return out;
    }
    function acharH2(re) {
      return h2.find(b => re.test(sem_acentos(b.text)));
    }

    // ---------- autoria
    const iByline = naoVazios.slice(0, 6).findIndex(b => b.type === "PARAGRAPH" && /^Por\s/i.test(b.text) && /OAB/i.test(b.text));
    const byline = iByline >= 0 ? naoVazios[iByline] : null;
    check("A1", "BLOQUEIA", byline && byline.text.indexOf(autor.nome) >= 0 && byline.text.indexOf(autor.oab) >= 0,
      "Assinatura no topo com nome e OAB do autor da área",
      byline ? "Assinatura encontrada: \"" + byline.text + "\" (esperado " + autor.nome + " – OAB/MG " + autor.oab + ")" : "Nenhuma linha \"Por ..., OAB/MG ...\" nos primeiros blocos");

    // ---------- palavra-chave
    const primeiroParagrafo = (byline ? naoVazios.slice(iByline + 1) : naoVazios).find(b => b.type === "PARAGRAPH" && b.text.length > 60);
    check("K1", "BLOQUEIA", contem(post.title, kw), "Palavra-chave exata no título (H1)", "Título: \"" + post.title + "\"");
    check("K2", "BLOQUEIA", primeiroParagrafo && contem(primeiroParagrafo.text, kw), "Palavra-chave exata no primeiro parágrafo",
      primeiroParagrafo ? "Primeiro parágrafo começa com: \"" + primeiroParagrafo.text.slice(0, 120) + "...\"" : "Primeiro parágrafo não encontrado");
    check("K3", "BLOQUEIA", h2.concat(h3).some(b => contem(b.text, kw)), "Palavra-chave exata em pelo menos um H2/H3", "");
    const nKw = ocorrencias(textoCompleto, kw);
    check("K4", "AVISO", nKw >= 4, "Palavra-chave repetida ao longo do texto (mín. 4 vezes)", "Ocorrências: " + nKw);

    // ---------- estrutura
    const tocs = bl.filter(b => b.type === "TOC");
    const primeiroH2 = h2[0];
    if (h2.length >= 4) {
      const tocOk = tocs.length === 1 && primeiroH2 && tocs[0].idx < primeiroH2.idx && (!byline || tocs[0].idx > byline.idx);
      check("E1", "BLOQUEIA", tocOk, "Exatamente um Sumário nativo (TOC), depois da introdução e antes do 1º H2",
        "Nós TOC encontrados: " + tocs.length);
      if (tocs.length) {
        const iToc = naoVazios.indexOf(tocs[0]);
        const anterior = iToc > 0 ? naoVazios[iToc - 1] : null;
        const rotulo = anterior && anterior.text.length < 90 &&
          /(neste|nesse|deste|desse) artigo|vai (encontrar|ver)|o que voc|sum[aá]rio|[ií]ndice/i.test(anterior.text);
        check("E2", "BLOQUEIA", !rotulo, "Sem título manual antes do Sumário (\"O que você vai ver...\")",
          rotulo ? "Remova o bloco: \"" + anterior.text + "\"" : "");
      }
    } else {
      check("E1", "AVISO", tocs.length === 0, "Sumário só em artigos com 4+ H2", "Há " + h2.length + " H2 e " + tocs.length + " TOC");
    }
    check("E3", "AVISO", h2.length >= 7 && h2.length <= 14, "Entre 7 e 14 seções H2 (padrão da casa: 8 a 12)", "H2 encontrados: " + h2.length);

    const box = acharH2(/^box d[oa] especialista/i);
    const faq = acharH2(/perguntas frequentes/i);
    const conclusao = acharH2(/^conclus/i);
    const porque = acharH2(/^por que (contar|analisar|procurar|ter)/i);
    const simul = acharH2(/simula|exemplo|quanto (voce|sua|pode|vale|custa|da)|o que pode estar em jogo/i);
    check("E4", "BLOQUEIA", !!box, "Seção \"Box do Especialista\"", "");
    check("E5", "BLOQUEIA", !!faq, "Seção \"Perguntas Frequentes\"", "");
    check("E6", "BLOQUEIA", !!conclusao && conclusao === h2[h2.length - 1], "Seção \"Conclusão: ...\" como último H2",
      conclusao ? "A conclusão não é o último H2" : "Sem H2 começando por \"Conclusão\"");
    check("E7", "AVISO", !!porque, "Seção \"Por Que Contar com um(a) Advogado(a) Especialista...\"", "");
    check("E8", "AVISO", !!simul, "Seção de simulação/exemplo numérico", "");
    if (simul) {
      const txtSimul = secao(simul).map(b => b.text).join(" ");
      check("E9", "BLOQUEIA", /hipot[eé]tic|ilustra/i.test(txtSimul), "Simulação rotulada como hipotética/ilustrativa (OAB)",
        "Inclua \"situação hipotética, apenas para ilustrar\" na seção \"" + simul.text + "\"");
    }
    if (box) {
      const prim = secao(box).find(b => b.text);
      check("E10", "AVISO", prim && /^Por\s/i.test(prim.text) && prim.text.indexOf(autor.nome) >= 0,
        "Box do Especialista abre com \"Por <autor>, OAB/MG ...\"", prim ? "Primeira linha: \"" + prim.text.slice(0, 100) + "\"" : "");
    }
    let perguntas = [];
    if (faq) {
      perguntas = secao(faq).filter(b => b.type === "HEADING" && b.level === 3);
      check("E11", "BLOQUEIA", perguntas.length >= 4 && perguntas.every(p => /\?\s*$/.test(p.text)),
        "FAQ com pelo menos 4 perguntas em H3 terminadas em \"?\"", "Perguntas H3: " + perguntas.length);
    }
    const titulos = h2.concat(h3).map(b => norm(b.text));
    const duplicados = titulos.filter((t, i) => titulos.indexOf(t) !== i);
    check("E12", "BLOQUEIA", duplicados.length === 0, "Nenhum subtítulo repetido", "Repetidos: " + duplicados.join(" | "));
    check("E13", "BLOQUEIA", bl.filter(b => b.type === "HEADING" && !b.text).length === 0, "Nenhum subtítulo vazio", "");

    // ---------- CTA e fechamento
    const botoes = bl.filter(b => b.type === "BUTTON");
    const bd = botoes.length === 1 ? botoes[0].node.buttonData || {} : {};
    const urlBotao = (bd.link && bd.link.url) || "";
    let textoWhats = "";
    try {
      textoWhats = decodeURIComponent(urlBotao.slice(WHATSAPP.length));
    } catch (e) {
      textoWhats = "";
    }
    check("C1", "BLOQUEIA", botoes.length === 1, "Exatamente um botão (nó BUTTON) de CTA", "Botões encontrados: " + botoes.length);
    if (botoes.length === 1) {
      check("C2", "BLOQUEIA", /^Falar com uma? Especialista no WhatsApp$/.test((bd.text || "").trim()),
        "Texto do botão \"Falar com um(a) Especialista no WhatsApp\"", "Texto atual: \"" + bd.text + "\"");
      check("C3", "BLOQUEIA", urlBotao.indexOf(WHATSAPP) === 0 && /estava lendo o artigo/i.test(textoWhats),
        "Botão aponta para o WhatsApp com mensagem pré-preenchida do artigo", "URL: " + urlBotao.slice(0, 120));
      const iBotao = naoVazios.indexOf(botoes[0]);
      const chamada = iBotao > 0 ? naoVazios[iBotao - 1] : null;
      check("C4", "AVISO", chamada && chamada.type === "PARAGRAPH" && temDecoracao(chamada.node, "BOLD"),
        "Frase de chamada em negrito logo antes do botão", chamada ? "Bloco anterior: \"" + chamada.text.slice(0, 100) + "\"" : "");
    }
    const todosLinks = links({ nodes: nodes });
    const whatsTexto = todosLinks.filter(l => /wa\.me|whatsapp\.com/i.test(l.url));
    check("C5", "BLOQUEIA", whatsTexto.length === 0, "Nenhum link de WhatsApp em texto além do botão (CTA duplicado)",
      "Links de WhatsApp no texto: " + whatsTexto.length);
    const ultimo = naoVazios[naoVazios.length - 1];
    check("C6", "BLOQUEIA", ultimo && ultimo.text === TAGLINE, "Tagline final \"" + TAGLINE + "\"",
      ultimo ? "Último bloco: \"" + (ultimo.text || ultimo.type).slice(0, 100) + "\"" : "");

    // ---------- links
    const paginas = (PAGINAS_SERVICO[CONFIG.frente] || []).concat(CONFIG.paginaServicoExtra ? [CONFIG.paginaServicoExtra] : []);
    const ehInterno = l => l.url.indexOf("rochaesantosadvocacia.com.br") >= 0 || /^\/(?!\/)/.test(l.url);
    const internos = todosLinks.filter(ehInterno);
    const linkServico = internos.some(l => paginas.some(p => {
      const caminho = l.url.replace(/^https?:\/\/(www\.)?rochaesantosadvocacia\.com\.br/, "").split(/[?#]/)[0].replace(/\/$/, "");
      return caminho === p;
    }));
    check("L1", "BLOQUEIA", paginas.length > 0 && linkServico, "Link no corpo para a página de serviço da frente " + CONFIG.frente,
      "Esperado um destes caminhos: " + (paginas.join(", ") || "(frente sem mapa — preencha paginaServicoExtra)"));
    check("L2", "AVISO", internos.length >= 2 && internos.length <= 8, "Entre 2 e 8 links internos", "Links internos: " + internos.length);
    const externos = todosLinks.filter(l => l.url && !ehInterno(l) && !/wa\.me/.test(l.url));
    const externosNaoOficiais = externos.filter(l => !DOMINIOS_OFICIAIS.some(re => re.test(dominio(l.url))));
    check("L3", "AVISO", externosNaoOficiais.length === 0, "Links externos só para fontes oficiais (gov.br, jus.br, leg.br)",
      "Não oficiais: " + externosNaoOficiais.map(l => l.url).join(", "));
    const ancorasManuais = todosLinks.filter(l => l.anchor);
    check("L4", "BLOQUEIA", ancorasManuais.length === 0, "Sem índice manual com âncoras (o Sumário nativo substitui)",
      "Links com âncora: " + ancorasManuais.length);

    // ---------- formatação
    const h2SemNegrito = h2.filter(b => !temDecoracao(b.node, "BOLD"));
    check("F1", "BLOQUEIA", h2SemNegrito.length === 0, "Todos os H2 em negrito", "Sem negrito: " + h2SemNegrito.map(b => b.text).join(" | "));
    const faqMalFormatada = perguntas.filter(p => !(temDecoracao(p.node, "BOLD") && temDecoracao(p.node, "ITALIC") &&
      temDecoracao(p.node, "FONT_SIZE", d => d.fontSizeData && d.fontSizeData.value === 20)));
    check("F2", "BLOQUEIA", faqMalFormatada.length === 0, "Perguntas do FAQ (H3) em negrito + itálico + 20px",
      "Fora do padrão: " + faqMalFormatada.map(b => b.text).join(" | "));
    const paragrafos = bl.filter(b => b.type === "PARAGRAPH" && b.text);
    const justificados = paragrafos.filter(b => {
      const pd = b.node.paragraphData;
      return pd && pd.textStyle && pd.textStyle.textAlignment === "JUSTIFY";
    });
    check("F3", "AVISO", paragrafos.length === 0 || justificados.length / paragrafos.length >= 0.9,
      "Parágrafos justificados (90%+)", justificados.length + " de " + paragrafos.length);
    const imagemTopo = nodes.slice(0, 3).find(n => n.type === "IMAGE");
    check("F4", "AVISO", imagemTopo && contem((imagemTopo.imageData && imagemTopo.imageData.altText) || "", kw),
      "Imagem de capa no topo do corpo com alt text contendo a palavra-chave", imagemTopo ? "Alt atual: \"" + (imagemTopo.imageData.altText || "") + "\"" : "Sem imagem no topo");
    const capa = post.media && (post.media.wixMedia || post.media.embedMedia);
    check("F5", "AVISO", !!capa, "Imagem de capa do post definida (aparece no feed)", "Defina a capa nas Configurações do post");

    // ---------- tamanho e linguagem
    check("T1", "BLOQUEIA", palavras >= 1200, "Pelo menos 1.200 palavras", "Palavras: " + palavras);
    check("T2", "AVISO", palavras >= 1500 && palavras <= 3300, "Entre 1.500 e 3.300 palavras (padrão da casa: 2.000 a 2.800)", "Palavras: " + palavras);
    const proibidas = [];
    LISTA_NEGRA.forEach(re => {
      const m = re.exec(textoCompleto + "\n" + (post.excerpt || ""));
      if (m) proibidas.push(m[0]);
    });
    check("O1", "BLOQUEIA", proibidas.length === 0, "Sem expressões vedadas pela OAB / lista negra", "Encontradas: " + proibidas.join(" | "));
    const honorarios = /honor[aá]rios/i.test(textoCompleto);
    check("O2", "AVISO", !honorarios, "Não falar de honorários do escritório", "O texto menciona \"honorários\": confirme que não é sobre o preço do escritório");
    const erros = [];
    ERROS_CONHECIDOS.forEach(re => {
      const m = re.exec(textoCompleto);
      if (m) erros.push(m[0]);
    });
    const espacos = /\S  +\S/.test(textoCorpo);
    check("O3", "BLOQUEIA", erros.length === 0, "Sem erros de digitação conhecidos", "Encontrados: " + erros.join(" | "));
    check("O4", "AVISO", !espacos, "Sem espaços duplos no texto", "");

    // ---------- fontes jurídicas
    const citacoes = extrairCitacoes(textoCompleto);
    const chavesFontes = new Set();
    const fontesSemUrl = [];
    const fontesNaoOficiais = [];
    (CONFIG.fontes || []).forEach(f => {
      const ks = extrairCitacoes(f.citacao || "");
      if (ks.size) ks.forEach((v, k) => chavesFontes.add(k));
      else chavesFontes.add(norm(f.citacao));
      if (!/^https?:\/\//i.test(f.url || "")) fontesSemUrl.push(f.citacao);
      else if (!DOMINIOS_OFICIAIS.some(re => re.test(dominio(f.url)))) fontesNaoOficiais.push(f.citacao + " -> " + dominio(f.url));
    });
    const semFonte = [];
    citacoes.forEach((trecho, chave) => {
      if (!citacaoCoberta(chave, chavesFontes)) semFonte.push(trecho);
    });
    check("J1", "BLOQUEIA", semFonte.length === 0, "Toda citação jurídica tem fonte conferida em CONFIG.fontes",
      "Sem fonte: " + semFonte.join(" | "));
    check("J2", "BLOQUEIA", fontesSemUrl.length === 0, "Toda fonte tem URL", "Sem URL: " + fontesSemUrl.join(" | "));
    check("J3", "AVISO", fontesNaoOficiais.length === 0, "Fontes em sites oficiais (planalto, STJ, STF, gov.br...)",
      "Não oficiais: " + fontesNaoOficiais.join(" | "));

    // ---------- SEO
    const seo = post.seoData || {};
    const tags = seo.tags || [];
    const titleTag = tags.find(t => t.type === "title");
    const titleTxt = titleTag ? titleTag.children || "" : "";
    const meta = tags.find(t => t.type === "meta" && t.props && t.props.name === "description");
    const metaTxt = meta ? meta.props.content || "" : "";
    const robots = tags.find(t => t.type === "meta" && t.props && t.props.name === "robots");
    const og = ["og:title", "og:description", "og:type"].filter(p => tags.some(t => t.props && t.props.property === p));
    const article = tags.filter(t => t.type === "script").map(t => {
      try {
        return JSON.parse(t.children);
      } catch (e) {
        return null;
      }
    }).find(j => j && j["@type"] === "Article");
    const kwMain = ((seo.settings && seo.settings.keywords) || []).find(k => k.isMain);
    check("S1", "BLOQUEIA", titleTxt && titleTxt.length <= 60 && contem(titleTxt, kw), "Title tag com até 60 caracteres e com a palavra-chave",
      "Title tag (" + titleTxt.length + "): \"" + titleTxt + "\"");
    check("S2", "BLOQUEIA", metaTxt && metaTxt.length <= 156 && contem(metaTxt, kw), "Meta description com até 156 caracteres e com a palavra-chave",
      "Meta (" + metaTxt.length + "): \"" + metaTxt + "\"");
    check("S3", "BLOQUEIA", kwMain && norm(kwMain.term) === norm(kw), "Palavra-chave principal configurada no SEO do Wix",
      "Configurada: \"" + (kwMain ? kwMain.term : "") + "\"");
    check("S4", "BLOQUEIA", article && JSON.stringify(article.author || {}).indexOf(CONFIG.autor === "rafael" ? "Rafael Rocha" : "Fernanda") >= 0,
      "Dado estruturado (JSON-LD) Article com o autor correto", article ? "Autor no JSON-LD: " + JSON.stringify(article.author) : "Sem JSON-LD Article");
    check("S5", "BLOQUEIA", !(robots && /noindex/i.test(robots.props.content || "")), "Indexação permitida (sem noindex)", "");
    check("S6", "AVISO", og.length === 3, "Open Graph (og:title, og:description, og:type)", "Presentes: " + og.join(", "));
    const slugN = norm((post.slug || "").replace(/-/g, " "));
    const kwTokens = norm(kw).split(" ").filter(t => t.length > 3);
    check("S7", "AVISO", kwTokens.every(t => slugN.indexOf(t) >= 0), "Slug contém as palavras principais da palavra-chave", "Slug: " + post.slug);
    check("S8", "AVISO", post.excerpt && post.excerpt.length <= 160, "Resumo (excerpt) preenchido com até 160 caracteres",
      "Resumo (" + (post.excerpt || "").length + ")");

    const bloqueios = resultados.filter(r => !r.ok && r.nivel === "BLOQUEIA");
    const avisos = resultados.filter(r => !r.ok && r.nivel === "AVISO");
    const aprovados = resultados.filter(r => r.ok).length;
    return {
      status: bloqueios.length ? "REPROVADO" : (avisos.length ? "APROVADO_COM_AVISOS" : "APROVADO"),
      nota: Math.round((aprovados / resultados.length) * 100),
      postId: post.id,
      titulo: post.title,
      situacaoNoWix: post.status,
      estatisticas: {
        palavras: palavras,
        h2: h2.length,
        perguntasFaq: perguntas.length,
        linksInternos: internos.length,
        ocorrenciasPalavraChave: nKw,
        citacoesJuridicas: citacoes.size
      },
      bloqueios: bloqueios.map(r => r.id + " " + r.descricao + (r.detalhe ? " — " + r.detalhe : "")),
      avisos: avisos.map(r => r.id + " " + r.descricao + (r.detalhe ? " — " + r.detalhe : "")),
      citacoesDetectadas: Array.from(citacoes.values()),
      verificacoes: resultados.length,
      aprovadas: aprovados
    };
  }

  // ------------------------------------------------------------- main
  if (!CONFIG.postId || /COLE_AQUI/.test(CONFIG.postId)) {
    return {
      erro: "Preencha CONFIG.postId"
    };
  }
  const post = await buscar();
  if (!post) {
    return {
      postId: CONFIG.postId,
      publicado: false,
      mensagem: "O post ainda não está publicado no blog."
    };
  }
  if (CONFIG.modo === "snapshot_rascunho" || CONFIG.modo === "snapshot_publicado") {
    return {
      postId: post.id,
      publicado: post.status === "PUBLISHED",
      titulo: post.title,
      slug: post.slug,
      status: post.status,
      markdown: markdown(post.title, (post.richContent && post.richContent.nodes) || [])
    };
  }
  if (!AUTORES[CONFIG.autor]) {
    return {
      erro: "CONFIG.autor deve ser \"rafael\" ou \"fernanda\""
    };
  }
  if (!CONFIG.palavraChave || /COLE_AQUI/.test(CONFIG.palavraChave)) {
    return {
      erro: "Preencha CONFIG.palavraChave"
    };
  }
  return revisar(post);
}
