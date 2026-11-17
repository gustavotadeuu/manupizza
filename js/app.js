/* ManuPizza — lógica do site (cardápio, sacola, pedido pelo WhatsApp).
   Os dados ficam em js/dados.js. */
(function () {
  "use strict";

  const L = window.LOJA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icone = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const sabor = id => SABORES.find(s => s.id === +id);
  const bebida = id => BEBIDAS.find(b => b.id === id);
  const combo = id => COMBOS.find(c => c.id === id);
  const borda = id => BORDAS.find(b => b.id === id) || BORDAS[0];
  const tamanho = id => TAMANHOS.find(t => t.id === id);
  const CHAVE_SACOLA = "manupizza-sacola-v1";
  const CHAVE_CLIENTE = "manupizza-cliente-v1";
  const linkWhats = txt => `https://wa.me/${L.whatsapp}${txt ? "?text=" + encodeURIComponent(txt) : ""}`;

  /* ---------------- Horário (fuso de Brasília) ---------------- */
  const minutos = hhmm => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmtHora = hhmm => {
    if (hhmm === "24:00" || hhmm === "00:00") return "00h00";
    return hhmm.replace(":", "h");
  };
  const NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  function agoraLoja() {
    if (window.__AGORA_TESTE) return window.__AGORA_TESTE; // { dia, min } – usado nos testes
    const p = new Intl.DateTimeFormat("en-US", { timeZone: L.fusoHorario, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).reduce((o, x) => (o[x.type] = x.value, o), {});
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { dia, min: (+p.hour % 24) * 60 + +p.minute };
  }
  const turnosDoDia = dia => L.horarios.filter(h => h.dias.includes(dia));

  function statusLoja() {
    const { dia, min } = agoraLoja();
    // turno de hoje
    for (const h of turnosDoDia(dia)) {
      const a = minutos(h.abre); let f = minutos(h.fecha); if (f <= a) f += 1440;
      if (min >= a && min < f) return { aberto: true, texto: `Aberto agora · fecha às ${fmtHora(h.fecha)}` };
    }
    // turno de ontem que passa da meia-noite
    const ontem = (dia + 6) % 7;
    for (const h of turnosDoDia(ontem)) {
      const a = minutos(h.abre), f = minutos(h.fecha);
      if (f <= a && f !== 0 && min < f) return { aberto: true, texto: `Aberto agora · fecha às ${fmtHora(h.fecha)}` };
    }
    // próxima abertura
    for (let k = 0; k < 7; k++) {
      const d = (dia + k) % 7;
      const prox = turnosDoDia(d).map(h => minutos(h.abre)).filter(a => k > 0 || a > min).sort((x, y) => x - y)[0];
      if (prox !== undefined) {
        const quando = k === 0 ? "hoje" : k === 1 ? "amanhã" : NOMES_DIA[d];
        const hh = String(Math.floor(prox / 60)).padStart(2, "0") + ":" + String(prox % 60).padStart(2, "0");
        return { aberto: false, texto: `Fechado agora · abre ${quando} às ${fmtHora(hh)}` };
      }
    }
    return { aberto: false, texto: "Fechado agora" };
  }

  function pintarStatus() {
    const s = statusLoja();
    $$("[data-status]").forEach(e => {
      e.classList.toggle("status--aberto", s.aberto);
      e.classList.toggle("status--fechado", !s.aberto);
      $("b", e).textContent = s.aberto ? "Aberto agora" : "Fechado agora";
      e.title = s.texto;
    });
    $$("[data-hoje]").forEach(e => e.textContent = s.texto);
    return s;
  }

  /* ---------------- Preenchimento de dados fixos ---------------- */
  const e = L.endereco;
  const enderecoTxt = e.rua ? `${e.rua} – ${e.bairro}, ${e.cidade}-${e.uf}${e.cep ? ", " + e.cep : ""}` : "Endereço a preencher";

  function preencherFixos() {
    $$("[data-whats]").forEach(a => a.href = linkWhats("Olá, ManuPizza! Vim pelo site."));
    $$("[data-insta]").forEach(a => a.href = `https://instagram.com/${L.instagram}`);
    $$("[data-frase]").forEach(x => x.textContent = L.frase);
    $$("[data-endereco]").forEach(x => x.textContent = enderecoTxt);
    $$("[data-end-curto]").forEach(x => x.innerHTML = e.rua ? `Endereço: <a href="${L.mapa}" target="_blank" rel="noopener">${esc(e.rua)} – ${esc(e.bairro)}</a>.` : "");
    $$("[data-mapa]").forEach(a => { if (L.mapa) a.href = L.mapa; else a.hidden = true; });
    $$("[data-tempo-entrega]").forEach(x => x.textContent = L.tempoEntrega ? ` Tempo médio: ${L.tempoEntrega}.` : "");
    $$("[data-tempo-retirada]").forEach(x => x.textContent = L.tempoRetirada ? ` Fica pronta em ${L.tempoRetirada}.` : "");
    $$("[data-ano]").forEach(x => x.textContent = new Date().getFullYear());
    const temBairros = Object.keys(L.entrega.porBairro || {}).length;
    $$("[data-taxa]").forEach(x => x.textContent = temBairros ? "conforme o bairro" : brl(L.entrega.taxaFixa));
    $$("[data-nota]").forEach(x => x.textContent = `${AVALIACOES.nota} no ${AVALIACOES.fonte} (${AVALIACOES.total} avaliações)`);
    const hoje = agoraLoja().dia;
    const horas = L.horarios.map(h => `<li class="${h.dias.includes(hoje) ? "hoje" : ""}"><span>${h.rotulo}</span><b>${fmtHora(h.abre)} às ${fmtHora(h.fecha)}</b></li>`).join("");
    $$("[data-horas]").forEach(u => u.innerHTML = horas);
    $("#lista-bairros").innerHTML = Object.keys(L.entrega.porBairro || {}).map(b => `<option value="${esc(b)}">`).join("");
    const pags = L.pagamentos.length ? L.pagamentos : ["Combinar pelo WhatsApp"];
    $("[data-pagamentos]").innerHTML = pags.map(p => `<option>${esc(p)}</option>`).join("");
  }

  /* ---------------- Categorias ---------------- */
  const CATEGORIAS = [
    { id: "salgadas", nome: "Salgadas", icone: "fatia", tem: () => SABORES.some(s => s.tipo === "salgada") },
    { id: "doces", nome: "Doces", icone: "doce", tem: () => SABORES.some(s => s.tipo === "doce") },
    { id: "bebidas", nome: "Bebidas", icone: "copo", tem: () => BEBIDAS.length > 0 },
    { id: "combos", nome: "Combos", icone: "combo", tem: () => COMBOS.length > 0 }
  ].filter(c => c.tem());

  function montarAtalhos() {
    const cats = CATEGORIAS.map(c => `<a class="atalho" href="#cardapio" data-ir-aba="${c.id}"><span class="circ">${icone(c.icone)}</span>${c.nome}</a>`);
    const extras = [
      ["#entrega", "moto", "Entrega"], ["#entrega", "retirada", "Retirada"],
      ["#como-pedir", "celular", "Como pedir"], ["#avaliacoes", "balao", "Clientes"]
    ].map(([h, i, n]) => `<a class="atalho" href="${h}"><span class="circ">${icone(i)}</span>${n}</a>`);
    $("[data-atalhos]").innerHTML = cats.concat(extras).join("");
    $$("[data-ir-aba]").forEach(a => a.addEventListener("click", () => trocarAba(a.dataset.irAba)));
  }

  function precoDe(s) {
    return TAMANHOS.map(t => s.precos[t.id] != null ? `<span>${t.nome} <b>${brl(s.precos[t.id])}</b></span>` : "").join("");
  }

  function cardSabor(s, comSelo) {
    const selo = s.maisPedida ? `<span class="selo">Mais pedida</span>` : comSelo && s.destaque ? `<span class="selo">Destaque</span>` : "";
    return `<button type="button" class="card" data-sabor="${s.id}" data-busca-txt="${esc((s.nome + " " + s.desc).toLowerCase())}">
      <span class="card__foto"><img src="${s.foto}" alt="" loading="lazy" width="240" height="240">${selo}</span>
      <span class="card__corpo">
        <span class="card__nome">${esc(s.nome)}</span>
        <span class="card__desc">${esc(s.desc)}</span>
        <span class="card__precos">${precoDe(s)}</span>
      </span>
      <span class="card__mais" aria-hidden="true">${icone("mais")}</span>
    </button>`;
  }

  function cardBebida(b) {
    return `<button type="button" class="card card--bebida" data-bebida="${b.id}" data-busca-txt="${esc((b.nome + " " + (b.opcoes || []).join(" ")).toLowerCase())}">
      <span class="circ circ--p">${icone("copo")}</span>
      <span class="card__corpo">
        <span class="card__nome">${esc(b.nome)}</span>
        <span class="card__desc">${[b.volume, (b.opcoes || []).join(", ")].filter(Boolean).map(esc).join(" · ")}</span>
        <span class="card__precos"><b>${brl(b.preco)}</b></span>
      </span>
      <span class="card__mais" aria-hidden="true">${icone("mais")}</span>
    </button>`;
  }

  function somaCombo(c, escolhas) {
    return c.slots.reduce((t, sl, k) => t + (sl.tipo === "pizza" ? sabor(escolhas[k]).precos[sl.tam] : bebida(sl.id).preco), 0);
  }
  function minimoCombo(c) {
    return c.slots.reduce((t, sl) => t + (sl.tipo === "pizza"
      ? Math.min(...SABORES.filter(x => x.tipo === sl.sabor && x.precos[sl.tam] != null).map(x => x.precos[sl.tam]))
      : bebida(sl.id).preco), 0) - c.desconto;
  }
  function cardCombo(c) {
    return `<button type="button" class="card card--combo" data-combo="${c.id}" data-busca-txt="${esc((c.nome + " " + c.desc).toLowerCase())}">
      ${c.foto ? `<span class="card__foto"><img src="${c.foto}" alt="" loading="lazy"><span class="selo">Combo</span></span>` : `<span class="circ circ--p">${icone("combo")}</span>`}
      <span class="card__corpo">
        <span class="card__nome">${esc(c.nome)}</span>
        <span class="card__desc">${esc(c.desc)}</span>
        <span class="card__precos"><span>a partir de <b>${brl(minimoCombo(c))}</b></span></span>
        <span class="card__eco">Economize ${brl(c.desconto)}</span>
      </span>
      <span class="card__mais" aria-hidden="true">${icone("mais")}</span>
    </button>`;
  }

  const minPreco = lista => Math.min(...lista.flatMap(x => x.precos ? Object.values(x.precos) : [x.preco]));
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

  function resumoGrupo(id, nome, desc, itens, thumbs, extra = "") {
    const fotos = thumbs.length
      ? `<span class="g__fotos">${thumbs.slice(0, 3).map(f => `<img src="${f}" alt="" loading="lazy" width="240" height="240">`).join("")}</span>`
      : `<span class="circ circ--p">${icone("copo")}</span>`;
    return `<details class="g" data-g="${id}">
      <summary>
        ${fotos}
        <span class="g__txt"><b>${esc(nome)}</b><small>${esc(desc)}</small><em>${extra}</em></span>
        <span class="g__seta" aria-hidden="true">${icone("seta")}</span>
      </summary>
      <div class="cards">${itens}</div>
    </details>`;
  }

  function montarCardapio() {
    const secoes = [];
    // Pizzas salgadas e doces, por tipo
    [["salgadas", "salgada", "Pizzas salgadas"], ["doces", "doce", "Pizzas doces"]].forEach(([sid, tipo, titulo]) => {
      const grupos = GRUPOS.filter(g => g.tipo === tipo).map(g => {
        const ss = SABORES.filter(x => x.grupo === g.id);
        if (!ss.length) return "";
        const fotos = ss.slice().sort((a, b) => (!!b.real - !!a.real)).map(x => x.foto);
        return resumoGrupo(g.id, g.nome, g.desc, ss.map(x => cardSabor(x)).join(""), fotos, `${plural(ss.length, "sabor", "sabores")} · a partir de ${brl(minPreco(ss))}`);
      }).join("");
      if (grupos) secoes.push(`<section class="cat" id="sec-${sid}"><h3 class="cat__tit">${icone(tipo === "doce" ? "doce" : "fatia")}${titulo}</h3>${grupos}</section>`);
    });
    // Bebidas
    if (BEBIDAS.length) {
      const nomes = [...new Set(BEBIDAS.map(b => b.grupo || "Bebidas"))];
      secoes.push(`<section class="cat" id="sec-bebidas"><h3 class="cat__tit">${icone("copo")}Bebidas</h3>${nomes.map(n => {
        const bs = BEBIDAS.filter(b => (b.grupo || "Bebidas") === n);
        return resumoGrupo("beb-" + n, n, bs.map(b => b.nome.replace(/^(Refrigerante|Cerveja|Suco) /, "")).join(", "), bs.map(cardBebida).join(""), [], `${plural(bs.length, "opção", "opções")} · a partir de ${brl(minPreco(bs))}`);
      }).join("")}</section>`);
    }
    // Combos
    if (COMBOS.length) {
      secoes.push(`<section class="cat" id="sec-combos"><h3 class="cat__tit">${icone("combo")}Combos</h3>${resumoGrupo("combos", "Combos com desconto", "Pizza + refrigerante com preço menor", COMBOS.map(cardCombo).join(""), COMBOS.map(c => c.foto).filter(Boolean), `${plural(COMBOS.length, "combo", "combos")}`)}</section>`);
    }
    $("[data-cardapio]").innerHTML = secoes.join("");
    $("[data-abas]").innerHTML = CATEGORIAS.map(c => `<a class="aba" href="#sec-${c.id}" data-ir-aba="${c.id}">${icone(c.icone)}${c.nome}</a>`).join("");
    $$("[data-abas] [data-ir-aba]").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); trocarAba(a.dataset.irAba); }));
    $("[data-busca]").addEventListener("input", filtrar);

    // Vitrine (fotos mais bonitas)
    const dest = VITRINE.map(sabor).filter(Boolean);
    $("[data-destaques]").innerHTML = dest.map(x => `<button type="button" class="vit" data-sabor="${x.id}">
        <img src="${x.foto}" alt="Pizza ${esc(x.nome)} da ManuPizza" loading="lazy" width="540" height="540">
        <span class="vit__txt"><b>${esc(x.nome)}</b><small>${x.tipo === "doce" ? "Pizza doce" : "Pizza salgada"} · a partir de ${brl(Math.min(...Object.values(x.precos)))}</small></span>
        <span class="vit__btn">Pedir</span>
      </button>`).join("");
    if (!dest.length) $("#destaques").hidden = true;

    if (PROMOCOES.length) {
      $("#promocoes").hidden = false;
      $("[data-promos]").innerHTML = PROMOCOES.map(p => `<article class="promo"><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p>${p.validade ? `<small>${esc(p.validade)}</small>` : ""}${p.aba ? `<a href="#sec-${p.aba}" class="link-seta" data-ir-aba="${p.aba}">Ver combos ${icone("seta")}</a>` : ""}</article>`).join("");
      $$("[data-promos] [data-ir-aba]").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); trocarAba(a.dataset.irAba); }));
    }

    document.addEventListener("click", ev => {
      const c = ev.target.closest("[data-sabor],[data-bebida],[data-combo]");
      if (!c) return;
      if (c.dataset.sabor) abrirPizza(+c.dataset.sabor);
      else if (c.dataset.bebida) abrirBebida(c.dataset.bebida);
      else if (c.dataset.combo) abrirCombo(c.dataset.combo);
    });
  }

  // Leva até a categoria; se ela tiver um grupo só, já abre.
  function trocarAba(id) {
    const sec = $("#sec-" + id);
    if (!sec) return;
    const gs = $$("details.g", sec);
    if (gs.length === 1) gs[0].open = true;
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function filtrar() {
    const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const q = norm($("[data-busca]").value.trim());
    let total = 0;
    $$("details.g").forEach(g => {
      let n = 0;
      $$(".card", g).forEach(c => { const ok = !q || norm(c.dataset.buscaTxt).includes(q); c.hidden = !ok; if (ok) n++; });
      g.hidden = q && n === 0;
      g.open = !!q && n > 0;
      total += n;
    });
    $$(".cat").forEach(c => c.hidden = q && !$$("details.g", c).some(g => !g.hidden));
    $("[data-sem-resultado]").hidden = !q || total > 0;
  }

  /* ---------------- Preço ---------------- */
  function precoPizza(item) {
    const ps = item.sabores.map(id => sabor(id).precos[item.tam]);
    let base;
    if (ps.length === 1) base = ps[0];
    else if (L.meioAMeio.regra === "maior") base = Math.max(...ps);
    else if (L.meioAMeio.regra === "media") base = Math.round((ps[0] + ps[1]) / 2 * 100) / 100;
    else base = Math.max(...ps); // não deve acontecer: meio a meio desligado
    return base + borda(item.borda).preco;
  }
  function precoUnit(item) {
    if (item.tipo === "pizza") return precoPizza(item);
    if (item.tipo === "bebida") return bebida(item.id).preco;
    if (item.tipo === "combo") { const c = combo(item.id); return somaCombo(c, item.escolhas) - c.desconto; }
    return 0;
  }
  function nomeItem(item) {
    if (item.tipo === "pizza") {
      const t = tamanho(item.tam).nome;
      const nomes = item.sabores.map(id => sabor(id).nome);
      const tipo = sabor(item.sabores[0]).tipo === "doce" ? "Pizza doce" : "Pizza";
      return nomes.length > 1 ? `${tipo} ${t.toLowerCase()} meio a meio: ${nomes.join(" / ")}` : `${tipo} ${t.toLowerCase()} – ${nomes[0]}`;
    }
    if (item.tipo === "bebida") { const b = bebida(item.id); return b.nome + (item.opcao ? ` (${item.opcao})` : ""); }
    if (item.tipo === "combo") { const n = combo(item.id).nome; return /^combo/i.test(n) ? n : "Combo – " + n; }
    return "";
  }
  function detalhesItem(item) {
    const d = [];
    if (item.tipo === "pizza") { const b = borda(item.borda); if (b.preco) d.push(`${b.nome} (+${brl(b.preco)})`); }
    if (item.tipo === "combo") {
      const c = combo(item.id);
      c.slots.forEach((sl, k) => d.push(sl.tipo === "pizza"
        ? `Pizza ${tamanho(sl.tam).nome.toLowerCase()}${sl.sabor === "doce" ? " doce" : ""}: ${sabor(item.escolhas[k]).nome}`
        : `${bebida(sl.id).nome}${item.escolhas[k] ? " (" + item.escolhas[k] + ")" : ""}`));
    }
    if (item.obs) d.push("Obs.: " + item.obs);
    return d;
  }

  /* ---------------- Sacola ---------------- */
  let sacola = [];
  try { sacola = JSON.parse(localStorage.getItem(CHAVE_SACOLA)) || []; } catch (_) { sacola = []; }
  // descarta itens que não existem mais no cardápio
  sacola = sacola.filter(i => (i.tipo === "pizza" && i.sabores?.every(sabor) && tamanho(i.tam)) || (i.tipo === "bebida" && bebida(i.id)) || (i.tipo === "combo" && combo(i.id) && Array.isArray(i.escolhas) && combo(i.id).slots.every((sl, k) => sl.tipo !== "pizza" || sabor(i.escolhas[k]))));

  const chaveItem = i => JSON.stringify([i.tipo, i.id, i.tam, i.sabores && [...i.sabores].sort(), i.borda, i.opcao, i.escolhas, i.obs || ""]);
  function salvar() { try { localStorage.setItem(CHAVE_SACOLA, JSON.stringify(sacola)); } catch (_) {} pintarSacola(); }

  function adicionar(item) {
    const k = chaveItem(item);
    const ex = sacola.find(i => chaveItem(i) === k);
    if (ex) ex.qtd += item.qtd; else sacola.push(item);
    salvar();
    toast(`${item.qtd}× ${nomeItem(item)} na sacola`);
  }
  function mudarQtd(idx, d) {
    sacola[idx].qtd += d;
    if (sacola[idx].qtd <= 0) sacola.splice(idx, 1);
    salvar();
  }

  function taxaEntrega(modo, bairro) {
    if (modo !== "entrega") return 0;
    const pb = L.entrega.porBairro || {};
    const chave = Object.keys(pb).find(b => b.toLowerCase() === String(bairro || "").trim().toLowerCase());
    return chave ? pb[chave] : L.entrega.taxaFixa;
  }
  function descontosPromo() {
    const hoje = agoraLoja().dia;
    return PROMOCOES.filter(p => p.regra && p.regra.dia === hoje).map(p => {
      let valor = 0;
      if (p.regra.tipo === "bordaGratis") {
        sacola.forEach(i => { if (i.tipo === "pizza" && i.borda === p.regra.borda && (!p.regra.tam || i.tam === p.regra.tam)) valor += borda(i.borda).preco * i.qtd; });
      }
      return { titulo: p.titulo, valor };
    }).filter(p => p.valor > 0);
  }
  function totais(modo = "entrega", bairro = "") {
    const subtotal = sacola.reduce((s, i) => s + precoUnit(i) * i.qtd, 0);
    const economia = sacola.reduce((s, i) => i.tipo === "combo" ? s + combo(i.id).desconto * i.qtd : s, 0);
    const promos = descontosPromo();
    const desconto = promos.reduce((s, p) => s + p.valor, 0);
    const taxa = sacola.length ? taxaEntrega(modo, bairro) : 0;
    return { subtotal, economia, promos, desconto, taxa, total: subtotal - desconto + taxa, qtd: sacola.reduce((s, i) => s + i.qtd, 0) };
  }

  function pintarSacola() {
    const t = totais();
    $$("[data-qtd]").forEach(x => { x.textContent = t.qtd; x.hidden = !t.qtd; });
    $("[data-barra]").hidden = !t.qtd;
    $("[data-barra-qtd]").textContent = t.qtd + (t.qtd === 1 ? " item" : " itens");
    $("[data-barra-total]").textContent = brl(t.subtotal - t.desconto);
    const box = $("[data-itens]");
    if (!sacola.length) {
      box.innerHTML = `<div class="sacola__vazia"><span class="circ">${icone("sacola")}</span><p>Sua sacola está vazia.</p><a href="#cardapio" class="btn btn--laranja" data-fechar-sacola>Ver cardápio</a></div>`;
      $("[data-sacola-rodape]").innerHTML = "";
      return;
    }
    box.innerHTML = sacola.map((i, idx) => `<div class="item">
        <div class="item__txt"><b>${esc(nomeItem(i))}</b>${detalhesItem(i).map(d => `<small>${esc(d)}</small>`).join("")}<span class="item__preco">${brl(precoUnit(i))} cada</span></div>
        <div class="qtd">
          <button type="button" data-menos="${idx}" aria-label="Diminuir">${icone(i.qtd === 1 ? "lixo" : "menos")}</button>
          <span>${i.qtd}</span>
          <button type="button" data-mais="${idx}" aria-label="Aumentar">${icone("mais")}</button>
        </div>
        <b class="item__total">${brl(precoUnit(i) * i.qtd)}</b>
      </div>`).join("");
    $("[data-sacola-rodape]").innerHTML = `
      <div class="linha"><span>Subtotal</span><b>${brl(t.subtotal)}</b></div>
      ${t.economia ? `<div class="linha linha--eco"><span>Você economiza nos combos</span><b>${brl(t.economia)}</b></div>` : ""}
      ${t.promos.map(p => `<div class="linha linha--eco"><span>${esc(p.titulo)}</span><b>− ${brl(p.valor)}</b></div>`).join("")}
      <div class="linha"><span>Entrega</span><span>${brl(L.entrega.taxaFixa)} · retirada sem taxa</span></div>
      <button type="button" class="btn btn--laranja btn--cheio" data-finalizar>Finalizar pedido · ${brl(t.subtotal - t.desconto)}</button>
      <button type="button" class="link-sutil" data-esvaziar>Esvaziar sacola</button>`;
  }

  function abrirSacola() {
    $("#sacola").classList.add("aberta"); $("#sacola").setAttribute("aria-hidden", "false");
    $("[data-veu]").hidden = false; document.body.classList.add("trava");
  }
  function fecharSacola() {
    $("#sacola").classList.remove("aberta"); $("#sacola").setAttribute("aria-hidden", "true");
    $("[data-veu]").hidden = true; document.body.classList.remove("trava");
  }

  /* ---------------- Modal de pizza ---------------- */
  const mp = $("#modal-produto");
  function abrirPizza(id) {
    const s = sabor(id);
    const meio = !!L.meioAMeio.regra;
    const outros = SABORES.filter(o => o.id !== s.id && (L.meioAMeio.misturarSalgadaComDoce || o.tipo === s.tipo));
    const regraTxt = L.meioAMeio.regra === "maior" ? "Cobramos o valor do sabor mais caro." : "Cobramos a média dos dois sabores.";
    $("[data-mp-conteudo]").innerHTML = `
      <img class="mp__foto" src="${s.foto}" alt="" width="240" height="240">
      <h2 id="mp-titulo">${esc(s.nome)}</h2>
      <p class="mp__desc">${esc(s.desc)}</p>
      <fieldset class="opc"><legend>Tamanho</legend>
        ${TAMANHOS.filter(t => s.precos[t.id] != null).map((t, k) => `<label class="opc__l"><input type="radio" name="tam" value="${t.id}" ${k === 0 ? "checked" : ""}><span>${t.nome}${t.fatias ? ` <small>· ${t.fatias} fatias</small>` : ""}</span><b data-preco-tam="${t.id}">${brl(s.precos[t.id])}</b></label>`).join("")}
      </fieldset>
      ${meio ? `<fieldset class="opc"><legend>Meio a meio <i>(opcional)</i></legend>
        <label class="opc__l"><input type="checkbox" name="meio"><span>Quero dois sabores</span></label>
        <label class="campo" data-segundo hidden><span>Segundo sabor</span><select name="sabor2">${outros.map(o => `<option value="${o.id}">${esc(o.nome)}</option>`).join("")}</select></label>
        <p class="nota">${regraTxt}</p></fieldset>` : ""}
      ${BORDAS.length > 1 ? `<fieldset class="opc"><legend>Borda</legend>
        ${BORDAS.map((b, k) => `<label class="opc__l"><input type="radio" name="borda" value="${b.id}" ${k === 0 ? "checked" : ""}><span>${esc(b.nome)}</span><b>${b.preco ? "+ " + brl(b.preco) : ""}</b></label>`).join("")}
      </fieldset>` : ""}
      <label class="campo campo--largo"><span>Observação <i>(opcional)</i></span><input name="obs" maxlength="140" placeholder="Ex.: sem cebola"></label>
      <div class="mp__acao">
        <div class="qtd qtd--g"><button type="button" data-q="-1" aria-label="Diminuir">${icone("menos")}</button><span data-q-val>1</span><button type="button" data-q="1" aria-label="Aumentar">${icone("mais")}</button></div>
        <button type="submit" value="add" class="btn btn--laranja" data-add>Adicionar <span data-mp-total></span></button>
      </div>`;
    const f = $("[data-form-produto]");
    let qtd = 1;
    const ler = () => {
      const tam = f.tam.value;
      const sab = [s.id];
      if (meio && f.meio.checked) sab.push(+f.sabor2.value);
      return { tipo: "pizza", tam, sabores: sab, borda: f.borda ? f.borda.value : "sem", obs: f.obs.value.trim(), qtd };
    };
    const atualizar = () => {
      if (meio) $("[data-segundo]", f).hidden = !f.meio.checked;
      $("[data-mp-total]", f).textContent = brl(precoPizza(ler()) * qtd);
      $("[data-q-val]", f).textContent = qtd;
    };
    f.oninput = f.onchange = atualizar;
    $$("[data-q]", f).forEach(b => b.onclick = () => { qtd = Math.max(1, qtd + +b.dataset.q); atualizar(); });
    f.onsubmit = ev => { if (ev.submitter && ev.submitter.value === "add") { adicionar(ler()); } };
    atualizar();
    mp.showModal();
  }

  function abrirBebida(id) {
    const b = bebida(id);
    if (!b.opcoes || b.opcoes.length < 2) { adicionar({ tipo: "bebida", id, opcao: b.opcoes?.[0] || "", qtd: 1 }); return; }
    $("[data-mp-conteudo]").innerHTML = `
      <span class="circ circ--g">${icone("copo")}</span>
      <h2 id="mp-titulo">${esc(b.nome)}</h2>
      <p class="mp__desc">${[b.volume, brl(b.preco)].filter(Boolean).join(" · ")}</p>
      <fieldset class="opc"><legend>Escolha</legend>
        ${b.opcoes.map((o, k) => `<label class="opc__l"><input type="radio" name="opcao" value="${esc(o)}" ${k === 0 ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}
      </fieldset>
      <div class="mp__acao">
        <div class="qtd qtd--g"><button type="button" data-q="-1" aria-label="Diminuir">${icone("menos")}</button><span data-q-val>1</span><button type="button" data-q="1" aria-label="Aumentar">${icone("mais")}</button></div>
        <button type="submit" value="add" class="btn btn--laranja">Adicionar <span data-mp-total></span></button>
      </div>`;
    const f = $("[data-form-produto]");
    let qtd = 1;
    const atualizar = () => { $("[data-mp-total]", f).textContent = brl(b.preco * qtd); $("[data-q-val]", f).textContent = qtd; };
    f.oninput = f.onchange = null;
    $$("[data-q]", f).forEach(x => x.onclick = () => { qtd = Math.max(1, qtd + +x.dataset.q); atualizar(); });
    f.onsubmit = ev => { if (ev.submitter && ev.submitter.value === "add") adicionar({ tipo: "bebida", id, opcao: f.opcao.value, qtd }); };
    atualizar();
    mp.showModal();
  }
  function abrirCombo(id) {
    const c = combo(id);
    $("[data-mp-conteudo]").innerHTML = `
      ${c.foto ? `<img class="mp__foto" src="${c.foto}" alt="" width="240" height="240">` : `<span class="circ circ--g">${icone("combo")}</span>`}
      <h2 id="mp-titulo">${esc(c.nome)}</h2>
      <p class="mp__desc">${esc(c.desc)}<br><b class="eco">Economize ${brl(c.desconto)}</b></p>
      ${c.slots.map((sl, k) => {
        if (sl.tipo === "pizza") {
          const ops = SABORES.filter(x => x.tipo === sl.sabor && x.precos[sl.tam] != null);
          return `<label class="campo campo--largo"><span>Pizza ${tamanho(sl.tam).nome.toLowerCase()}${sl.sabor === "doce" ? " doce" : " salgada"}</span><select name="s${k}">${ops.map(x => `<option value="${x.id}">${esc(x.nome)} — ${brl(x.precos[sl.tam])}</option>`).join("")}</select></label>`;
        }
        const b = bebida(sl.id);
        return `<label class="campo campo--largo"><span>${esc(b.nome)}</span>${b.opcoes && b.opcoes.length > 1 ? `<select name="s${k}">${b.opcoes.map(o => `<option>${esc(o)}</option>`).join("")}</select>` : `<input name="s${k}" value="${esc(b.opcoes?.[0] || "")}" readonly>`}</label>`;
      }).join("")}
      <p class="nota" data-combo-calc></p>
      <div class="mp__acao">
        <div class="qtd qtd--g"><button type="button" data-q="-1" aria-label="Diminuir">${icone("menos")}</button><span data-q-val>1</span><button type="button" data-q="1" aria-label="Aumentar">${icone("mais")}</button></div>
        <button type="submit" value="add" class="btn btn--laranja">Adicionar <span data-mp-total></span></button>
      </div>`;
    const f = $("[data-form-produto]");
    let qtd = 1;
    const ler = () => c.slots.map((sl, k) => sl.tipo === "pizza" ? +f["s" + k].value : f["s" + k].value);
    const atualizar = () => {
      const soma = somaCombo(c, ler());
      $("[data-combo-calc]", f).textContent = `Separado: ${brl(soma)} · no combo: ${brl(soma - c.desconto)}`;
      $("[data-mp-total]", f).textContent = brl((soma - c.desconto) * qtd);
      $("[data-q-val]", f).textContent = qtd;
    };
    f.oninput = f.onchange = atualizar;
    $$("[data-q]", f).forEach(x => x.onclick = () => { qtd = Math.max(1, qtd + +x.dataset.q); atualizar(); });
    f.onsubmit = ev => { if (ev.submitter && ev.submitter.value === "add") adicionar({ tipo: "combo", id, escolhas: ler(), qtd }); };
    atualizar();
    mp.showModal();
  }
  mp.addEventListener("click", ev => { if (ev.target === mp) mp.close(); });

  /* ---------------- Checkout ---------------- */
  const ck = $("#checkout");
  const fc = $("[data-form-checkout]");

  function carregarCliente() {
    try {
      const c = JSON.parse(localStorage.getItem(CHAVE_CLIENTE)) || {};
      ["nome", "telefone", "rua", "bairro", "complemento"].forEach(k => { if (c[k] && !fc[k].value) fc[k].value = c[k]; });
      if (c.modo) fc.modo.value = c.modo;
    } catch (_) {}
  }

  function pintarCheckout() {
    const modo = fc.modo.value;
    const ent = modo === "entrega";
    $("[data-bloco-endereco]").hidden = !ent;
    $("[data-troco]").hidden = fc.pagamento.value !== "Dinheiro";
    ["rua", "bairro"].forEach(k => fc[k].required = ent);
    const ri = $("[data-retirada-info]");
    ri.hidden = ent;
    ri.innerHTML = e.rua ? `Retirada no balcão: <a href="${L.mapa}" target="_blank" rel="noopener">${esc(enderecoTxt)}</a>.` : "Retirada no balcão.";
    const t = totais(modo, fc.bairro.value);
    $("[data-resumo]").innerHTML = `<h3 class="mini">Resumo</h3>` +
      sacola.map(i => `<div class="linha"><span>${i.qtd}× ${esc(nomeItem(i))}${detalhesItem(i).map(d => `<small>${esc(d)}</small>`).join("")}</span><b>${brl(precoUnit(i) * i.qtd)}</b></div>`).join("") +
      `<div class="linha linha--sep"><span>Subtotal</span><b>${brl(t.subtotal)}</b></div>` +
      (t.economia ? `<div class="linha linha--eco"><span>Você economiza nos combos</span><b>${brl(t.economia)}</b></div>` : "") +
      t.promos.map(p => `<div class="linha linha--eco"><span>${esc(p.titulo)}</span><b>− ${brl(p.valor)}</b></div>`).join("") +
      `<div class="linha"><span>${ent ? "Taxa de entrega" : "Retirada"}</span><b>${ent ? brl(t.taxa) : "Grátis"}</b></div>` +
      `<div class="linha linha--total"><span>Total</span><b>${brl(t.total)}</b></div>`;
    const s = statusLoja();
    const av = $("[data-aviso-fechado]");
    av.hidden = s.aberto;
    av.textContent = s.aberto ? "" : `A ManuPizza está fechada agora (${s.texto.replace("Fechado agora · ", "")}). Você pode enviar o pedido, mas ele só será atendido no horário de funcionamento.`;
    $("[data-enviar-txt]").textContent = s.aberto ? "Enviar pedido no WhatsApp" : "Enviar mesmo assim no WhatsApp";
  }

  function abrirCheckout() {
    if (!sacola.length) return;
    fecharSacola();
    carregarCliente();
    pintarCheckout();
    ck.showModal();
  }

  function montarPedido() {
    const d = Object.fromEntries(new FormData(fc));
    const t = totais(d.modo, d.bairro);
    return { cliente: d, itens: sacola.map(i => ({ ...i, nome: nomeItem(i), detalhes: detalhesItem(i), unit: precoUnit(i) })), ...t, aberto: statusLoja().aberto };
  }

  function mensagemWhatsApp(p) {
    const c = p.cliente, ent = c.modo === "entrega";
    const ls = [];
    ls.push("*Novo pedido – ManuPizza*", "_Enviado pelo site_", "");
    p.itens.forEach(i => {
      ls.push(`*${i.qtd}x* ${i.nome} — ${brl(i.unit * i.qtd)}`);
      i.detalhes.forEach(x => ls.push(`   • ${x}`));
    });
    ls.push("", `Subtotal: ${brl(p.subtotal)}`);
    if (p.economia) ls.push(`Economia nos combos (já descontada): ${brl(p.economia)}`);
    p.promos.forEach(x => ls.push(`${x.titulo}: − ${brl(x.valor)}`));
    ls.push(ent ? `Taxa de entrega: ${brl(p.taxa)}` : "Retirada no balcão: sem taxa");
    ls.push(`*Total: ${brl(p.total)}*`, "");
    ls.push(`*${ent ? "Entrega" : "Retirada"}*`);
    ls.push(`Nome: ${c.nome}`, `Telefone: ${c.telefone}`);
    if (ent) {
      ls.push(`Endereço: ${c.rua} – ${c.bairro}`);
      if (c.complemento) ls.push(`Complemento/referência: ${c.complemento}`);
    }
    ls.push(`Pagamento: ${c.pagamento}`);
    if (c.pagamento === "Dinheiro" && c.troco) ls.push(`Troco para: ${c.troco}`);
    if (c.obs) ls.push(`Observações: ${c.obs}`);
    if (!p.aberto) ls.push("", "_Pedido enviado fora do horário de atendimento._");
    return ls.join("\n");
  }

  async function enviarPedido(ev) {
    ev.preventDefault();
    let ok = true;
    $$("input[required]", fc).forEach(i => {
      const bad = !i.closest("[hidden]") && !i.value.trim();
      i.closest(".campo").classList.toggle("erro", bad);
      if (bad) ok = false;
    });
    const tel = fc.telefone.value.replace(/\D/g, "");
    if (tel.length < 10) { fc.telefone.closest(".campo").classList.add("erro"); ok = false; }
    if (!ok) { toast("Preencha os campos destacados."); $(".erro input", fc)?.focus(); return; }

    const pedido = montarPedido();
    try {
      const { nome, telefone, rua, bairro, complemento, modo } = pedido.cliente;
      localStorage.setItem(CHAVE_CLIENTE, JSON.stringify({ nome, telefone, rua, bairro, complemento, modo }));
    } catch (_) {}
    const r = await Pagamento.iniciar(pedido);
    if (r.status !== "enviar_whatsapp") return;
    const url = linkWhats(mensagemWhatsApp(pedido));
    window.__ULTIMO_LINK = url;
    const w = window.open(url, "_blank", "noopener");
    if (!w && !window.__TESTE) location.href = url;
    ck.close();
    sacola = []; salvar();
    toast("Pedido aberto no WhatsApp. É só enviar a mensagem!");
  }

  /* ---------------- Avaliações ---------------- */
  function montarAvaliacoes() {
    const a = AVALIACOES;
    const estrelas = n => Array.from({ length: 5 }, (_, k) => icone("estrela", k < n ? "cheia" : "")).join("");
    $("[data-avals]").innerHTML = `
      <div class="aval aval--nota"><b class="aval__n">${a.nota}</b><span class="aval__est">${estrelas(5)}</span><p>${a.total} avaliações no ${a.fonte}</p><a class="link-seta" href="${a.link}" target="_blank" rel="noopener">Ver no ${a.fonte} ${icone("seta")}</a></div>` +
      a.itens.map(i => `<figure class="aval"><span class="aval__est">${estrelas(i.estrelas)}</span><blockquote>“${esc(i.texto)}”</blockquote><figcaption>${esc(i.nome)} · ${a.fonte}</figcaption></figure>`).join("");
  }

  /* ---------------- Toast ---------------- */
  let tt;
  function toast(msg) {
    const t = $("[data-toast]"); t.textContent = msg; t.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2600);
  }

  /* ---------------- Eventos gerais ---------------- */
  document.addEventListener("click", ev => {
    if (ev.target.closest("[data-abrir-sacola]")) { ev.preventDefault(); abrirSacola(); }
    if (ev.target.closest("[data-fechar-sacola]") || ev.target.matches("[data-veu]")) fecharSacola();
    const m = ev.target.closest("[data-mais]"); if (m) mudarQtd(+m.dataset.mais, 1);
    const n = ev.target.closest("[data-menos]"); if (n) mudarQtd(+n.dataset.menos, -1);
    if (ev.target.closest("[data-finalizar]")) abrirCheckout();
    if (ev.target.closest("[data-esvaziar]")) { sacola = []; salvar(); }
    if (ev.target.closest("[data-fechar-checkout]")) ck.close();
  });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape") fecharSacola(); });
  fc.addEventListener("input", ev => { ev.target.closest(".campo")?.classList.remove("erro"); pintarCheckout(); });
  fc.addEventListener("change", pintarCheckout);
  fc.addEventListener("submit", enviarPedido);

  /* ---------------- Início ---------------- */
  preencherFixos();
  montarAtalhos();
  montarCardapio();
  montarAvaliacoes();
  pintarSacola();
  pintarStatus();
  setInterval(pintarStatus, 60000);

  // exposto para testes
  window.ManuPizza = { statusLoja, pintarStatus, precoPizza, totais, mensagemWhatsApp, montarPedido, get sacola() { return sacola; } };
})();
