# Site ManuPizza

Site estático (HTML, CSS e JS, sem dependências). Abra `index.html` ou publique a pasta inteira (Vercel, Netlify, GitHub Pages).

## Onde editar
Tudo fica em **`js/dados.js`**:
- `LOJA` — contato, endereço, horários, taxa de entrega (fixa ou por bairro), formas de pagamento e a regra do **meio a meio**.
- `SABORES` — pizzas salgadas e doces, com preço da grande (`G`) e da pequena (`P`).
- `BORDAS`, `BEBIDAS`, `COMBOS`, `PROMOCOES` e `AVALIACOES`.

Seções sem dados (combos, promoções) não aparecem.

## Itens de exemplo — confirmar com a pizzaria
Marcados com `[NÃO CONFIRMADO]` em `js/dados.js` (não existem nas fontes):
- Meio a meio cobrando o sabor mais caro (`meioAMeio.regra: "maior"`; troque para `"media"` ou `null`).
- Formas de pagamento: Pix, cartão de crédito/débito na entrega e dinheiro (com troco).
- Tempo de entrega (40 a 60 min) e de retirada (25 a 35 min).
- Número de fatias: grande 8, pequena 4.
- 3 combos (Família, Salgada + Doce, Casal) com desconto fixo sobre a soma real dos itens.
- Promoção "Segunda especial com pizza" (borda de catupiry grátis nas grandes às segundas). A faixa existe na fachada, mas a regra é um exemplo.
- Volume das latas (350 ml) e do suco Del Valle (1 L).

Horário: o site usa o do post fixado no Instagram; o Google Maps mostra outro (ex.: segunda fechado).

## Pagamento online
`js/pagamento.js` está preparado para uma integração futura (Pix/cartão). Hoje nada é cobrado pelo site: o pedido vai para o WhatsApp. Chaves secretas de pagamento nunca devem ficar no navegador.

## Fontes dos dados (17/11/2026)
- Cardápio, preços, bordas, taxa e endereço: https://manupizza.minutofood.com.br
- Avaliações e fotos: perfil da Manupizza no Google Maps
- Frase, horário, WhatsApp e Instagram: @manupizzaoficial
- Fotos dos sabores: as mesmas usadas pela pizzaria no cardápio online.
