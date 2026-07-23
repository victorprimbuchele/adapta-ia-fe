// A IA às vezes devolve `content` com tags HTML literais (ex.: instruções
// de alto contraste levam o modelo a "estilizar" a resposta), que o backend
// não sanitiza. Extrai só o texto via DOMParser (nunca via innerHTML) para
// exibir a variante como texto puro, com ou sem tags na resposta original.
export function stripHtmlTags(value: string): string {
  if (!/<[a-z][\s\S]*>/i.test(value)) return value;

  const doc = new DOMParser().parseFromString(value, "text/html");
  return doc.body.textContent?.trim() ?? value;
}
