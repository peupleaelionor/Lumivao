// Maquette mobile statique du hero — montre l'entrée produit et les sorties.

const OUTPUTS = ["Flyer", "Story", "QR code", "WhatsApp", "Mini-vitrine", "Fidélité"];

export function PhoneMockup() {
  return (
    <div className="mx-auto w-[300px] max-w-full rounded-[38px] bg-ink p-3 shadow-lift">
      <div className="rounded-[28px] bg-cream p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[0.8125rem] text-ink-soft">
            <span className="block font-medium text-ink">Chez Awa</span>
            Votre commerce est prêt
          </div>
          <div className="h-8 w-8 rounded-full bg-ink" />
        </div>

        <p className="mb-3 font-display text-[1.0625rem] font-semibold">
          Que voulez-vous vendre aujourd&apos;hui ?
        </p>
        <div className="rounded border border-line bg-surface p-3.5 text-sm">
          Poulet braisé + riz + boisson à{" "}
          <span className="font-semibold text-orange-dense">9,90 €</span>
        </div>
        <div className="mt-3 flex h-11 items-center justify-center rounded bg-ink text-[0.9375rem] font-medium text-cream">
          Créer l&apos;offre
        </div>

        <p className="mb-2.5 mt-4 text-xs text-ink-soft">Vos supports prêts à partager</p>
        <div className="grid grid-cols-2 gap-2">
          {OUTPUTS.map((o) => (
            <div
              key={o}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-[0.8125rem] font-medium"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              {o}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
