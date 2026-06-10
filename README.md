# LUMIVAO

**Vendez plus chaque jour, même sans site.**

LUMIVAO transforme une simple offre — « voilà ce que je vends aujourd'hui » — en
flyer, QR code, message WhatsApp, menu et mini-vitrine, en moins d'une minute.

> L'assistance commerciale est **invisible** : aucun écran ne parle d'« IA ».
> Le commerçant écrit son offre, tout est prêt, il partage, il vend.

---

## 1. Stack

- **Next.js 14** (App Router) + **TypeScript strict**
- **Tailwind CSS** (charte LUMIVAO : crème / noir / vert commerce)
- **Zod** — validation de toutes les entrées API
- **OpenAI** côté serveur uniquement, avec **repli local garanti**
- **qrcode** — génération QR (PNG/SVG)
- **html-to-image** — export flyer PNG
- **Supabase / PostgreSQL** (Prisma + SQL fournis) — optionnel en démo
- **PWA** mobile-first (manifest inclus)

### Mode démo vs production
Le MVP est **immédiatement testable sans base de données** : l'état (commerce,
produits, offres, clients) est persisté dans `localStorage`. Pour la production,
branchez Supabase (schéma fourni) ; les clients serveur basculent automatiquement.

---

## 2. Démarrage

```bash
npm install            # dépendances
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Autres commandes :

```bash
npm run build          # build de production
npm run start          # serveur de production
npm run typecheck      # TypeScript strict
npm run lint           # ESLint (next/core-web-vitals)
```

---

## 3. Variables d'environnement

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=                 # serveur uniquement — si absente : repli local
OPENAI_MODEL=gpt-4o-mini        # modèle économique par défaut
DATABASE_URL=                   # PostgreSQL (Prisma)
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # serveur uniquement
```

> **Sécurité** : `OPENAI_API_KEY` et `SUPABASE_SERVICE_ROLE_KEY` ne sont jamais
> préfixées `NEXT_PUBLIC_` et ne sont lues que dans des route handlers serveur.

---

## 4. Base de données (Supabase)

1. Créez un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** → collez `supabase/schema.sql` → Run.
   (Crée les tables + RLS : le propriétaire gère son commerce, lecture publique
   limitée aux offres publiées et produits actifs.)
3. Renseignez les variables Supabase dans `.env.local`.

Alternative Prisma :

```bash
npm run prisma:generate
npm run prisma:push        # pousse prisma/schema.prisma vers DATABASE_URL
```

---

## 5. Déploiement Vercel

1. Poussez le repo sur GitHub.
2. Importez le projet sur [vercel.com](https://vercel.com) (preset Next.js).
3. Ajoutez les variables d'environnement (section 3).
4. Déployez. `NEXT_PUBLIC_APP_URL` = votre domaine de production.

---

## 6. Architecture

```
src/
  app/
    page.tsx                      # Landing premium (11 sections)
    layout.tsx                    # Inter + Manrope, métadonnées, PWA
    app/
      (dash)/                     # espace commerçant (AppShell + nav mobile)
        page.tsx                  # « Que voulez-vous vendre aujourd'hui ? »
        onboarding/               # création commerce (3 étapes)
        today/                    # offre du jour → 3 offres → supports
        products/  menu/  flyers/  customers/
      (public)/                   # rendu plein écran, sans shell
        public/[slug]/            # mini-vitrine publique
        tv/[businessId]/          # affichage TV
    api/
      ai/offer-engine/            # moteur d'offres : 3 offres scorées + reco (repli local)
      ai/advisor/                 # conseiller « Conseil du jour » (repli local)
      flyer/generate/  qr/  whatsapp/message/  public/business/
  components/  ui/ layout/ landing/ offers/ products/ flyers/ qr/ public/
  lib/        ai/ autopilot/ qr/ whatsapp/ validators/ store/ supabase/ utils.ts
  data/       business-types.ts  offer-templates.ts
  types/
prisma/schema.prisma
supabase/schema.sql
```

### Le moteur d'offres « invisible » — `src/lib/ai/` + `src/lib/offers/`
`runOfferEngine()` : valide (Zod) → enrichit avec les règles métier
(`data/offer-rules.ts`) → OpenAI (JSON strict) → **score chaque offre /100**
(`lib/offers/offer-score.ts`) → recommande la meilleure → repli local garanti
(`data/templates/precise-offer-templates.ts`). Chaque situation produit 3 offres :
**marge protégée / vente rapide / panier premium**. Le flux ne casse jamais.
`generateAdvice()` alimente le « Conseil du jour » (diagnostic + action).

### LUMIVAO Autopilot — `src/lib/autopilot/`
Propose chaque jour **3 actions** adaptées au type de commerce (menu midi,
arrivage, créneau libre, accessoire du jour…). Local au départ, enrichissable.

---

## 7. Flux MVP (testable de bout en bout)

1. **Landing** `/`
2. **Onboarding** `/app/onboarding` — type, nom, ville, WhatsApp
3. **Produits** `/app/products`
4. **Offre du jour** `/app/today` — saisie libre
5. **3 offres** générées (prudente / agressive / premium)
6. **Sélection** d'une offre
7. **Flyer** (aperçu + export PNG)
8. **Message WhatsApp** (copier / partager)
9. **QR code** (commande / menu)
10. **Mini-vitrine** `/app/public/[slug]`
11. **Historique** `/app/flyers`
12. **Affichage TV** `/app/tv/[businessId]`

---

## 8. Checklist de test

- [ ] `npm run build` passe sans erreur
- [ ] `/` s'affiche (charte crème/noir/vert, mobile-first)
- [ ] Onboarding crée le commerce et redirige vers `/app`
- [ ] « Créer l'offre » génère **3 offres** (badge « Mode hors-ligne » sans clé OpenAI)
- [ ] Sélection → flyer + message WhatsApp + QR + lien vitrine
- [ ] « Copier le message » fonctionne ; le lien `wa.me` s'ouvre
- [ ] « Publier » → l'offre apparaît dans `/app/flyers`
- [ ] `/app/public/[slug]` montre l'offre du jour + bouton WhatsApp
- [ ] `/app/tv/[businessId]` s'affiche en plein écran, lisible de loin
- [ ] `GET /api/qr?data=...` renvoie une image PNG
- [ ] Entrée invalide sur `/api/ai/offer` → HTTP 422

Tests rapides API :

```bash
curl -X POST localhost:3000/api/ai/offer -H 'Content-Type: application/json' \
  -d '{"businessType":"snack","businessName":"Chez Awa","intention":"Poulet braisé + riz + boisson à 9,90 €"}'

curl "localhost:3000/api/qr?data=https://lumivao.app&size=240" -o qr.png
```

---

## 9. Hors périmètre MVP (volontairement)

Paiement complet, marketplace, livraison, app native, gros CRM, analytics
avancées, automatisations lourdes, multi-pays avancé, éditeur type Canva.
Le schéma prévoit l'avenir (plans, assets, analytics) sans l'activer.

---

## 10. Plan des 7 prochains jours

| Jour | Objectif |
|---|---|
| **J1** | Brancher Supabase (auth + tables) ; migrer le store local vers la DB |
| **J2** | Auth propriétaire (magic link Supabase) + RLS vérifiée |
| **J3** | Persistance offres/produits/clients côté serveur + `/api/public/business` |
| **J4** | Enrichir Autopilot via OpenAI (actions du jour contextualisées) |
| **J5** | Flyer : formats story + affiche A4, 5 templates par métier |
| **J6** | Fidélité : coupons + relances WhatsApp + avis Google |
| **J7** | Stripe (Starter/Pro/Business + Installation), facturation simple, déploiement |

---

© LUMIVAO — Vendez plus chaque jour, même sans site.
