"use client";

import { useState } from "react";
import { useBusiness, useCustomers } from "@/lib/store/use-store";
import { addCustomer, addPoint } from "@/lib/store/local-store";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";

const LOYALTY_THRESHOLD = 5;

export default function CustomersPage() {
  const business = useBusiness();
  const customers = useCustomers();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!business) return null;

  function add() {
    if (!business || !name.trim()) return;
    addCustomer({ businessId: business.id, name: name.trim(), phone: phone.trim() || null });
    setName("");
    setPhone("");
  }

  function remind(custName: string, custPhone: string | null | undefined) {
    const msg = buildWhatsAppMessage("reminder", { businessName: business!.name, customerName: custName });
    window.open(buildWhatsAppLink(custPhone || "", msg), "_blank", "noopener");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Clients & fidélité</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          {LOYALTY_THRESHOLD} achats = 1 récompense. Faites revenir vos meilleurs clients.
        </p>
      </header>

      <Card className="bg-surface">
        <div className="flex flex-col gap-3">
          <Input label="Nom du client" placeholder="Awa" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Téléphone WhatsApp" placeholder="+33 6 …" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button onClick={add} disabled={!name.trim()}>
            Ajouter le client
          </Button>
        </div>
      </Card>

      {customers.length === 0 ? (
        <EmptyState
          title="Aucun client pour le moment."
          description="Ajoutez vos premiers clients pour activer la fidélité et les relances."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {customers.map((c) => {
            const reached = c.points >= LOYALTY_THRESHOLD;
            return (
              <Card key={c.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge tone={reached ? "promo" : "neutral"}>
                      {c.points} / {LOYALTY_THRESHOLD} {reached ? "— récompense !" : "achats"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-none gap-2">
                  <Button variant="secondary" size="sm" onClick={() => addPoint(c.id)}>
                    +1
                  </Button>
                  <Button size="sm" onClick={() => remind(c.name, c.phone)}>
                    Relancer
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
