"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_TYPES } from "@/data/business-types";
import { saveBusiness } from "@/lib/store/local-store";
import { slugify } from "@/lib/utils";
import type { BusinessTypeKey } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<BusinessTypeKey | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function finish() {
    if (!type || !name.trim()) return;
    saveBusiness({
      name: name.trim(),
      slug: slugify(name),
      type,
      city: city.trim() || null,
      whatsapp: whatsapp.trim() || null,
      phone: whatsapp.trim() || null,
      country: "FR",
    });
    router.replace("/app");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-4">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-green" : "bg-line")}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Quel type de commerce ?</h1>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">
              Cela nous aide à vous proposer les bons modèles.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {BUSINESS_TYPES.map((b) => (
              <button
                key={b.key}
                onClick={() => {
                  setType(b.key);
                  setStep(1);
                }}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border bg-surface p-4 text-left transition",
                  type === b.key ? "border-ink" : "border-line hover:border-ink",
                )}
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="font-medium">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Votre commerce</h1>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">
              Ces informations seront visibles sur vos supports publics.
            </p>
          </div>
          <Input label="Nom du commerce" placeholder="Chez Awa" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Ville" placeholder="Paris" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input
            label="Numéro WhatsApp"
            placeholder="+33 6 12 34 56 78"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(0)}>
              Retour
            </Button>
            <Button block onClick={() => setStep(2)} disabled={!name.trim()}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <Card className="bg-surface text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-tint text-green-dense">
              ✓
            </div>
            <h1 className="font-display text-2xl font-semibold">Votre espace est prêt.</h1>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">
              Vous pouvez créer votre première offre maintenant.
            </p>
          </Card>
          <Button block onClick={finish}>
            Créer ma première offre
          </Button>
        </div>
      )}
    </div>
  );
}
