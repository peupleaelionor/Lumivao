// ── Utilitaires WhatsApp ─────────────────────────────────────────────
// Aucune dépendance externe : on construit des liens wa.me propres.

/** Nettoie un numéro : ne garde que les chiffres (format international). */
export function cleanPhone(raw: string): string {
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  // 0X… (France) → 33X…
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `33${digits.slice(1)}`;
  }
  return digits.replace(/\D/g, "");
}

/** Génère un lien wa.me avec message pré-rempli. */
export function buildWhatsAppLink(phone: string, message: string): string {
  const number = cleanPhone(phone);
  const text = encodeURIComponent(message.trim());
  return number
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export type WhatsAppMessageKind =
  | "offer"
  | "reminder"
  | "review"
  | "order_ready";

/** Messages commerciaux courts, prêts à copier. */
export function buildWhatsAppMessage(
  kind: WhatsAppMessageKind,
  params: { businessName: string; offerTitle?: string; price?: string; customerName?: string; reviewUrl?: string },
): string {
  const { businessName, offerTitle, price, customerName, reviewUrl } = params;
  const hi = customerName ? `Bonjour ${customerName} 👋` : "Bonjour 👋";

  switch (kind) {
    case "offer":
      return `${hi} Aujourd'hui chez ${businessName} : ${offerTitle ?? "notre offre du jour"}${price ? ` à ${price}` : ""}. C'est disponible maintenant. Je vous le prépare ?`;
    case "reminder":
      return `${hi} Cela faisait un moment ! On a de belles offres en ce moment chez ${businessName}. Passez nous voir, on vous garde quelque chose 🙂`;
    case "review":
      return `${hi} Merci pour votre visite chez ${businessName} ! Si vous avez aimé, un petit avis nous aiderait beaucoup${reviewUrl ? ` : ${reviewUrl}` : ""}. Merci d'avance 🙏`;
    case "order_ready":
      return `${hi} Votre commande est prête chez ${businessName}${offerTitle ? ` : ${offerTitle}` : ""}. Vous pouvez passer la récupérer quand vous voulez. À tout de suite !`;
    default:
      return `${hi} Des nouvelles offres vous attendent chez ${businessName}.`;
  }
}
