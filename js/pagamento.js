/* =====================================================================
   Pagamento — preparado para integração futura (Pix / cartão).
   ---------------------------------------------------------------------
   Nesta primeira etapa NENHUM pagamento é processado pelo site.
   O pedido vai para o WhatsApp e o pagamento é combinado com a loja.

   Para integrar depois (ex.: Mercado Pago, Pagar.me, Asaas):
   1. Crie um back-end (ex.: função serverless) que receba o pedido,
      crie a cobrança com a CHAVE SECRETA do provedor e devolva só o
      link/QR Code. A chave secreta NUNCA deve ficar neste arquivo.
   2. Troque a função iniciar() abaixo para chamar esse back-end.
   3. Só marque o pedido como pago quando o provedor confirmar
      (webhook no servidor), nunca pelo navegador.
   ===================================================================== */

window.Pagamento = {
  integrado: false,

  /** Recebe o pedido montado e devolve o que fazer em seguida.
      Hoje: sempre segue para o WhatsApp, sem cobrar nada. */
  async iniciar(pedido) {
    return { status: "enviar_whatsapp", pedido };
  }
};
