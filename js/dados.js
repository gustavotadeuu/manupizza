/* =====================================================================
   ManuPizza — DADOS DO SITE (edite aqui)
   ---------------------------------------------------------------------
   Tudo o que aparece no site sai deste arquivo. Para mudar um preço,
   um horário, a taxa de entrega ou a regra do meio a meio, altere aqui.

   Fontes usadas (verificadas em 17/11/2026):
   - Cardápio, preços, bordas, taxa de entrega e endereço:
     cardápio online oficial  https://manupizza.minutofood.com.br
   - Endereço e avaliações: perfil da Manupizza no Google Maps
   - Frase, horários, WhatsApp e Instagram: perfil @manupizzaoficial
   Itens marcados com  [NÃO CONFIRMADO]  foram criados como exemplo
   (não existem nas fontes) e devem ser confirmados com a pizzaria.
   ===================================================================== */

window.LOJA = {
  nome: "ManuPizza",
  assinatura: "Pizza Artesanal",
  frase: "Pizzas que chegam, histórias que ficam.",
  cidade: "Franca-SP",
  atendimento: "Delivery e retirada",

  whatsapp: "5516993649696",            // só números, com 55 + DDD
  whatsappTexto: "(16) 99364-9696",
  instagram: "manupizzaoficial",

  // Endereço confirmado no cardápio online e no Google Maps.
  endereco: {
    rua: "Av. Domingos Sanna, 413",
    bairro: "São Joaquim",
    cidade: "Franca",
    uf: "SP",
    cep: "14406-330"
  },
  // Abre direto a ficha da Manupizza no Google Maps (com rotas).
  mapa: "https://maps.google.com/?cid=5174047217293953870",

  // Horário do post fixado no Instagram.
  // dias: 0 = domingo, 1 = segunda ... 6 = sábado. "24:00" = meia-noite.
  fusoHorario: "America/Sao_Paulo",
  horarios: [
    { rotulo: "Segunda a quinta", dias: [1, 2, 3, 4], abre: "18:00", fecha: "22:00" },
    { rotulo: "Sexta e sábado",   dias: [5, 6],       abre: "18:00", fecha: "24:00" },
    { rotulo: "Domingo",          dias: [0],          abre: "18:00", fecha: "23:00" }
  ],

  // [NÃO CONFIRMADO] tempos estimados
  tempoEntrega: "40 a 60 min",
  tempoRetirada: "25 a 35 min",

  entrega: {
    // Taxa do cardápio online: R$ 10,00 fixa.
    // Para cobrar por bairro, preencha porBairro, ex.: { "Centro": 8, "São Joaquim": 6 }.
    // Bairro que não estiver na lista usa a taxaFixa.
    taxaFixa: 10,
    porBairro: {},
    pedidoMinimo: 0
  },

  // Formas de pagamento: ainda não confirmadas com a pizzaria.
  // Preencha quando confirmar, ex.: ["Pix", "Cartão na entrega", "Dinheiro"].
  // Enquanto estiver vazio, o cliente vê "Combinar pelo WhatsApp".
  // [NÃO CONFIRMADO]
  pagamentos: ["Pix", "Cartão de crédito (na entrega)", "Cartão de débito (na entrega)", "Dinheiro"],

  // Meio a meio: a regra de preço NÃO foi confirmada pela pizzaria.
  // regra: null  -> opção escondida no site
  //        "maior" -> cobra o sabor mais caro
  //        "media" -> cobra a média dos dois sabores
  meioAMeio: {
    regra: "maior",   // [NÃO CONFIRMADO]
    misturarSalgadaComDoce: false
  }
};

/* Tamanhos (o cardápio online não informa fatias nem centímetros). */
window.TAMANHOS = [
  { id: "G", nome: "Grande", fatias: 8 },   // [NÃO CONFIRMADO] nº de fatias
  { id: "P", nome: "Pequena", fatias: 4 }
];

/* Bordas do cardápio online (mesmo preço para grande e pequena). */
window.BORDAS = [
  { id: "sem", nome: "Sem borda", preco: 0 },
  { id: "catupiry", nome: "Borda de catupiry", preco: 12 },
  { id: "catupiry-alho", nome: "Borda de catupiry com alho", preco: 15 },
  { id: "cheddar", nome: "Borda de cheddar", preco: 13 },
  { id: "chocolate", nome: "Borda de chocolate", preco: 15 }
];

/* Sabores. precos: { G: grande, P: pequena }.
   foto: imagem que a própria pizzaria usa no cardápio online.
   destaque / maisPedida: marcações feitas pela pizzaria no cardápio online. */
window.SABORES = [
  // ---------- SALGADAS ----------
  { id: 54, tipo: "salgada", nome: "Milho", desc: "Molho, mussarela, milho, orégano e azeitona", precos: { G: 59, P: 39 } },
  { id: 62, tipo: "salgada", nome: "Mussarela", desc: "Molho, mussarela, orégano, tomate e azeitona", precos: { G: 59, P: 38 } },
  { id: 10, tipo: "salgada", nome: "Bauru", desc: "Molho, presunto, mussarela, orégano e azeitona", precos: { G: 60, P: 39 } },
  { id: 14, tipo: "salgada", nome: "Calabresa", desc: "Molho, mussarela, calabresa, cebola, orégano e azeitona", precos: { G: 60, P: 40 }, destaque: true },
  { id: 28, tipo: "salgada", nome: "Dois Queijos", desc: "Molho, mussarela, catupiry, orégano e azeitona", precos: { G: 63, P: 40 } },
  { id: 16, tipo: "salgada", nome: "Calabresa com Catupiry", desc: "Molho, mussarela, calabresa, catupiry, orégano e azeitona", precos: { G: 64, P: 40 } },
  { id: 52, tipo: "salgada", nome: "Marguerita", desc: "Molho, mussarela, manjericão, tomate, orégano e azeitona", precos: { G: 64, P: 42 } },
  { id: 56, tipo: "salgada", nome: "Milho com Catupiry", desc: "Molho, mussarela, milho, catupiry, orégano e azeitona", precos: { G: 64, P: 43 } },
  { id: 22, tipo: "salgada", nome: "Chapéu de Palha", desc: "Molho, mussarela, milho verde, batata palha, orégano e azeitona", precos: { G: 65, P: 42 } },
  { id: 72, tipo: "salgada", nome: "Toscana", desc: "Calabresa, mussarela, champignon, alho frito, orégano e azeitona", precos: { G: 65, P: 42 } },
  { id: 74, tipo: "salgada", nome: "Três Queijos", desc: "Molho, mussarela, provolone, catupiry, orégano e azeitona", precos: { G: 65, P: 42 } },
  { id: 76, tipo: "salgada", nome: "Vegetariana", desc: "Molho, ervilha, milho, palmito, escarola, mussarela, orégano e azeitona", precos: { G: 65, P: 42 } },
  { id: 4,  tipo: "salgada", nome: "Atum", desc: "Molho, mussarela, atum, cebola, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 20, tipo: "salgada", nome: "Cocoricó", desc: "Molho, frango desfiado, milho, ovo, mussarela, catupiry e azeitona", precos: { G: 67, P: 46 } },
  { id: 30, tipo: "salgada", nome: "Escarola", desc: "Molho, escarola, bacon, mussarela, cebola, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 44, tipo: "salgada", nome: "Frango com Catupiry", desc: "Molho, mussarela, frango desfiado, catupiry, cebola, orégano e azeitona", precos: { G: 67, P: 44 }, destaque: true },
  { id: 46, tipo: "salgada", nome: "Hot Dog", desc: "Molho, mussarela, salsicha ao molho de tomate, milho, catupiry, batata palha, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 48, tipo: "salgada", nome: "Lombo com Catupiry", desc: "Molho, mussarela, lombo canadense, catupiry, cebola, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 64, tipo: "salgada", nome: "Palmito", desc: "Molho, mussarela, palmito, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 68, tipo: "salgada", nome: "Quatro Queijos", desc: "Molho, mussarela, parmesão, provolone, catupiry, orégano e azeitona", precos: { G: 67, P: 44 } },
  { id: 8,  tipo: "salgada", nome: "Baiana", desc: "Molho, mussarela, calabresa, pimentão picado, ovo, pimenta calabresa, orégano e azeitona", precos: { G: 68, P: 44 } },
  { id: 70, tipo: "salgada", nome: "Tomate Seco com Rúcula", desc: "Molho, tomate seco, mussarela, cebola, rúcula, orégano e azeitona", precos: { G: 68, P: 46 } },
  { id: 66, tipo: "salgada", nome: "Portuguesa com Catupiry", desc: "Molho, mussarela, presunto, catupiry, calabresa, palmito, ervilha, ovo, orégano e azeitona", precos: { G: 69, P: 45 } },
  { id: 2,  tipo: "salgada", nome: "À Moda da Casa", desc: "Molho, mussarela, calabresa, lombo, bacon, milho, catupiry, orégano e azeitona", precos: { G: 70, P: 45 } },
  { id: 6,  tipo: "salgada", nome: "Bacon com Catupiry", desc: "Molho, mussarela, catupiry, milho, orégano e azeitona", precos: { G: 70, P: 45 } },
  { id: 26, tipo: "salgada", nome: "D'Itália", desc: "Molho, mussarela, rolinho de presunto com catupiry, palmito, champignon, orégano e azeitona", precos: { G: 70, P: 46 } },
  { id: 32, tipo: "salgada", nome: "Especial de Brócolis", desc: "Molho, bacon, milho, brócolis refogado ao alho, orégano e azeitona", precos: { G: 70, P: 46 } },
  { id: 38, tipo: "salgada", nome: "Frangolombo", desc: "Molho, mussarela, frango, lombo, catupiry, cebola, orégano e azeitona", precos: { G: 70, P: 46 } },
  { id: 60, tipo: "salgada", nome: "Mista", desc: "Molho, presunto, mussarela, orégano, tomate e azeitona", precos: { G: 70, P: 46 } },
  { id: 12, tipo: "salgada", nome: "Caipira", desc: "Molho, mussarela, frango, ervilha, catupiry, palmito, cebola, milho, orégano e azeitona", precos: { G: 71, P: 46 } },
  { id: 18, tipo: "salgada", nome: "Cinco Queijos", desc: "Molho, mussarela, provolone, gorgonzola, parmesão, catupiry, orégano e azeitona", precos: { G: 71, P: 46 } },
  { id: 50, tipo: "salgada", nome: "Marajá", desc: "Molho, mussarela, lombo canadense, catupiry, palmito, bacon, calabresa, champignon, orégano e azeitona", precos: { G: 71, P: 46 } },
  { id: 58, tipo: "salgada", nome: "Mineira", desc: "Molho, mussarela, milho, couve refogada ao alho, ovo, bacon, linguiça defumada, orégano e azeitona", precos: { G: 71, P: 46 } },
  { id: 42, tipo: "salgada", nome: "Frango com Bacon e Catupiry", desc: "Molho, frango desfiado, bacon, mussarela, catupiry, orégano e azeitona", precos: { G: 72, P: 47 } },
  { id: 34, tipo: "salgada", nome: "Fialho", desc: "Molho, contrafilé ao alho, mussarela, orégano e azeitona", precos: { G: 74, P: 49 } },
  { id: 40, tipo: "salgada", nome: "Franmilho", desc: "Molho, frango, milho, mussarela, catupiry, bacon, orégano e azeitona", precos: { G: 76, P: 49 } },
  { id: 24, tipo: "salgada", nome: "D'Roma", desc: "Molho, bacon, milho, rolinho de presunto com catupiry, mussarela, orégano e azeitona", precos: { G: 77, P: 47 } },
  { id: 36, tipo: "salgada", nome: "Fialho com Catupiry e Cebola", desc: "Molho, contrafilé ao alho, mussarela, catupiry, cebola, orégano e azeitona", precos: { G: 78, P: 51 } },

  // ---------- DOCES ----------
  { id: 78, tipo: "doce", nome: "Banana Nevada", desc: "Banana, chocolate branco, canela, açúcar e creme de leite", precos: { G: 65, P: 44 }, destaque: true },
  { id: 80, tipo: "doce", nome: "Brigadeiro", desc: "Leite condensado, chocolate e granulado", precos: { G: 65, P: 45 } },
  { id: 82, tipo: "doce", nome: "Chocolate Mesclado", desc: "Chocolate preto, chocolate branco e creme de leite", precos: { G: 65, P: 44 } },
  { id: 84, tipo: "doce", nome: "M&M's", desc: "Leite condensado, chocolate e M&M's", precos: { G: 68, P: 46 } },
  { id: 94, tipo: "doce", nome: "Ouro Branco", desc: "Chocolate preto, chocolate branco e bombom picado", precos: { G: 72, P: 47 } },
  { id: 92, tipo: "doce", nome: "Sonho de Valsa", desc: "Chocolate e bombom picado", precos: { G: 72, P: 47 }, maisPedida: true },
  { id: 90, tipo: "doce", nome: "Kit Kat", desc: "Chocolate e Kit Kat em pedaços", precos: { G: 74, P: 49 }, maisPedida: true },
  { id: 86, tipo: "doce", nome: "Prestígio", desc: "Leite condensado, Prestígio em pedaços e chocolate", precos: { G: 74, P: 49 } },
  { id: 96, tipo: "doce", nome: "Kinder Bueno", desc: "Creme Bueno e bombom Kinder Bueno picado", precos: { G: 85, P: 52 } },
  { id: 88, tipo: "doce", nome: "Supreme", desc: "Chocolate, bombom Ferrero Rocher e bombom Raffaello", precos: { G: 100, P: 60 } }
];

/* Tipos de pizza (o cardápio do site agrupa os sabores assim).
   Para mudar um sabor de grupo, edite o mapa GRUPO_DO_SABOR (id do sabor -> id do grupo). */
window.GRUPOS = [
  { id: "classicas",  tipo: "salgada", nome: "Clássicas",            desc: "Mussarela, calabresa, marguerita e as preferidas de sempre" },
  { id: "queijos",    tipo: "salgada", nome: "Queijos",              desc: "Dois, três, quatro e cinco queijos" },
  { id: "catupiry",   tipo: "salgada", nome: "Com catupiry",         desc: "As clássicas com aquele catupiry cremoso" },
  { id: "frango",     tipo: "salgada", nome: "Frango",               desc: "Frango desfiado com catupiry, bacon, milho e mais" },
  { id: "especiais",  tipo: "salgada", nome: "Especiais da casa",    desc: "Contrafilé, lombo, rolinho de presunto e receitas da casa" },
  { id: "vegetais",   tipo: "salgada", nome: "Com vegetais",         desc: "Brócolis, escarola, rúcula, palmito e mais" },
  { id: "doces-chocolate", tipo: "doce", nome: "Doces de chocolate", desc: "Brigadeiro, chocolate mesclado e banana nevada" },
  { id: "doces-bombom",    tipo: "doce", nome: "Doces com bombom",   desc: "Kit Kat, Sonho de Valsa, Kinder Bueno, Supreme e mais" }
];
window.GRUPO_DO_SABOR = {
  62: "classicas", 52: "classicas", 14: "classicas", 10: "classicas", 60: "classicas", 54: "classicas", 4: "classicas", 64: "classicas", 8: "classicas", 72: "classicas",
  28: "queijos", 74: "queijos", 68: "queijos", 18: "queijos",
  16: "catupiry", 56: "catupiry", 6: "catupiry", 48: "catupiry", 66: "catupiry",
  44: "frango", 42: "frango", 20: "frango", 12: "frango", 38: "frango", 40: "frango",
  34: "especiais", 36: "especiais", 2: "especiais", 50: "especiais", 58: "especiais", 26: "especiais", 24: "especiais", 22: "especiais", 46: "especiais",
  76: "vegetais", 30: "vegetais", 32: "vegetais", 70: "vegetais",
  80: "doces-chocolate", 82: "doces-chocolate", 78: "doces-chocolate",
  84: "doces-bombom", 94: "doces-bombom", 92: "doces-bombom", 90: "doces-bombom", 86: "doces-bombom", 96: "doces-bombom", 88: "doces-bombom"
};
/* Vitrine: sabores com as fotos mais bonitas, usados nos destaques e na capa. */
/* Fotos REAIS da loja (Google Maps da ManuPizza) ligadas a um sabor.
   [NÃO CONFIRMADO] o sabor de cada foto foi deduzido pela aparência — confirme com a pizzaria.
   Onde houver foto real, ela substitui a foto ilustrativa do cardápio online. */
window.FOTOS_REAIS = {
  32: "img/reais/real-brocolis.webp",    // Especial de Brócolis
  66: "img/reais/real-portuguesa.webp",  // Portuguesa com Catupiry
  94: "img/reais/real-ourobranco.webp",  // Ouro Branco
  90: "img/reais/real-kitkat.webp",      // Kit Kat
  88: "img/reais/real-supreme.webp"      // Supreme
};
/* Vitrine "Direto do nosso forno": só sabores com foto real. */
window.VITRINE = [32, 90, 94, 66, 88];

SABORES.forEach(s => { s.foto = "img/sabores/" + s.id + ".webp"; });
SABORES.forEach(s => { s.grupo = GRUPO_DO_SABOR[s.id]; if (FOTOS_REAIS[s.id]) { s.foto = FOTOS_REAIS[s.id]; s.real = true; } });

/* Bebidas (o cardápio online não tem fotos de bebidas).
   opcoes: sabores/marcas listados pela própria pizzaria. */
window.BEBIDAS = [
  { id: "b107", grupo: "Refrigerantes", nome: "Refrigerante lata", volume: "Lata 350 ml", preco: 6,
    opcoes: ["Coca-Cola", "Coca-Cola Zero", "Fanta Laranja", "Fanta Uva", "Fanta Guaraná", "Sprite", "Guaraná", "Kuat"] },
  { id: "b102", grupo: "Cervejas", nome: "Cerveja Brahma / Antarctica / Bavaria", volume: "Lata 350 ml", preco: 6.5,
    opcoes: ["Brahma", "Antarctica", "Bavaria"] },
  { id: "b104", grupo: "Cervejas", nome: "Cerveja Brahma Puro Malte / Petra", volume: "Lata 350 ml", preco: 7.5,
    opcoes: ["Brahma Puro Malte", "Petra"] },
  { id: "b103", grupo: "Cervejas", nome: "Cerveja Heineken", volume: "Lata 350 ml", preco: 8 },
  { id: "b108", grupo: "Refrigerantes", nome: "Refrigerante 600 ml", volume: "600 ml", preco: 9,
    opcoes: ["Coca-Cola", "Coca-Cola Zero", "Fanta Laranja", "Fanta Uva", "Fanta Guaraná", "Sprite", "Guaraná", "Kuat"] },
  { id: "b106", grupo: "Refrigerantes", nome: "Fanta 2 litros", volume: "2 L", preco: 13,
    opcoes: ["Fanta Guaraná", "Fanta Laranja", "Fanta Uva"] },
  { id: "b105", grupo: "Refrigerantes", nome: "Coca-Cola 2 litros", volume: "2 L", preco: 15,
    opcoes: ["Coca-Cola", "Coca-Cola Zero"] },
  { id: "b109", grupo: "Sucos", nome: "Suco Life", volume: "1 L", preco: 16,
    opcoes: ["Laranja", "Uva"] },
  { id: "b110", grupo: "Sucos", nome: "Suco Del Valle", volume: "1 L", preco: 16.5,   // [NÃO CONFIRMADO] volume
    opcoes: ["Pêssego", "Uva (100% uva)"] }
];

/* Combos  [NÃO CONFIRMADO — criados como exemplo]
   O cliente escolhe os sabores; o preço é a soma dos itens escolhidos
   menos o "desconto" (por isso a economia mostrada é sempre real).
   slots: { tipo: "pizza", tam: "G"|"P", sabor: "salgada"|"doce" }
          { tipo: "bebida", id: "<id da bebida>" } */
window.COMBOS = [
  { id: "c-familia", nome: "Combo Família", desc: "1 pizza grande salgada + 1 Coca-Cola 2 L", desconto: 8,
    foto: "img/caixa-salgada.webp",
    slots: [ { tipo: "pizza", tam: "G", sabor: "salgada" }, { tipo: "bebida", id: "b105" } ] },
  { id: "c-doce", nome: "Combo Salgada + Doce", desc: "1 pizza grande salgada + 1 pizza pequena doce + 1 Coca-Cola 2 L", desconto: 14,
    foto: "img/caixa-doce-branco.webp",
    slots: [ { tipo: "pizza", tam: "G", sabor: "salgada" }, { tipo: "pizza", tam: "P", sabor: "doce" }, { tipo: "bebida", id: "b105" } ] },
  { id: "c-casal", nome: "Combo Casal", desc: "1 pizza pequena salgada + 2 refrigerantes lata", desconto: 4,
    foto: "img/caixa-doce.webp",
    slots: [ { tipo: "pizza", tam: "P", sabor: "salgada" }, { tipo: "bebida", id: "b107" }, { tipo: "bebida", id: "b107" } ] }
];

/* Promoções  [NÃO CONFIRMADO]
   A ManuPizza tem uma faixa "Segunda-feira especial com pizza!" na fachada,
   mas a regra da promoção não foi encontrada; a regra abaixo é um exemplo.
   regra (opcional) aplica o desconto automaticamente na sacola:
   { tipo: "bordaGratis", borda: "catupiry", tam: "G", dia: 1 }  (dia: 0=dom … 6=sáb) */
window.PROMOCOES = [
  { titulo: "Segunda especial com pizza", texto: "Toda segunda-feira, a borda de catupiry sai grátis nas pizzas grandes.", validade: "Válido às segundas, no delivery e na retirada",
    regra: { tipo: "bordaGratis", borda: "catupiry", tam: "G", dia: 1 } },
  { titulo: "Combos com desconto", texto: "Monte seu combo com pizza e refrigerante e pague menos do que pedindo separado.", validade: "Todos os dias", link: "#cardapio", aba: "combos" }
];

/* Avaliações reais do Google (texto exatamente como foi publicado). */
window.AVALIACOES = {
  nota: "5,0",
  total: 5,
  fonte: "Google",
  link: "https://www.google.com/maps/search/?api=1&query=Manupizza%20Franca%20SP",
  itens: [
    { nome: "Murilo R.", estrelas: 5, texto: "Pizza muito top, único defeito que não sobra nada pro outro dia kkkk" },
    { nome: "Daniel M.", estrelas: 5, texto: "Pizza excelente, bem recheada" }
  ]
};
