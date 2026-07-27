export function buildWhatsAppLink(telefone: string, mensagem: string): string {
  let digits = telefone.replace(/\D/g, "");
  if (!digits.startsWith("55") && digits.length <= 11) {
    digits = `55${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(mensagem)}`;
}
