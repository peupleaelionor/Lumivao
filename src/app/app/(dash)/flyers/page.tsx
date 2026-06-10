"use client";

import { useRouter } from "next/navigation";
import { useBusiness, useOffers } from "@/lib/store/use-store";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";
import { OfferCard } from "@/components/offers/OfferCard";
import { EmptyState } from "@/components/ui/States";

export default function FlyersPage() {
  const router = useRouter();
  const business = useBusiness();
  const offers = useOffers();

  function share(message: string) {
    const link = buildWhatsAppLink(business?.whatsapp || "", message);
    window.open(link, "_blank", "noopener");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Mes offres</h1>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">Historique de vos offres et flyers.</p>
        </div>
        <LinkButton href="/app/today" size="sm">
          Nouvelle offre
        </LinkButton>
      </header>

      {offers.length === 0 ? (
        <EmptyState
          title="Aucune offre pour le moment."
          description="Créez votre première offre et commencez à publier aujourd'hui."
          action={<LinkButton href="/app/today">Créer mon offre</LinkButton>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((o) => (
            <OfferCard
              key={o.id}
              offer={o}
              onView={() => router.push(`/app/tv/${o.businessId}`)}
              onShare={() => share(o.whatsappMessage)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
