# Audit des repos `peupleaelionor/*` & matrice de récupération

## Contrainte d'accès (importante)

La session de build est **restreinte en lecture au seul repo `peupleaelionor/lumivao`**.
Les lectures de fichiers sur `MABELE-CORE`, `Lumia-`, `PM-Chat`, etc. renvoient
*Access denied*. L'audit ci-dessous est donc **basé sur les métadonnées** (nom,
langage, topics, dates) des 95 repos visibles via la recherche GitHub, pas sur
le code source. Pour une récupération **fichier par fichier**, il faut ajouter
les repos cibles au périmètre de la session.

Décision appliquée : **reconstruction propre** (conforme à la consigne « si les
repos sont instables, reconstruis proprement »). Zéro dette, TypeScript strict,
architecture exacte. La matrice ci-dessous reste le plan de récupération à
exécuter dès que l'accès est élargi.

---

## Audit par catégorie (métadonnées)

| Repo | Langage / signaux | Pertinence LUMIVAO | Décision |
|---|---|---|---|
| `MABELE-CORE` | TS, privé, récent | Architecture SaaS, wrappers OpenAI probables | S'inspirer / récupérer (lib/ai) |
| `Init-SaaS` | TS | Setup SaaS, auth Supabase | Récupérer (auth/supabase) |
| `nextjs-boilerplate` | TS | Base Next.js | Ignorer (reconstruit plus propre) |
| `qquizz` / `qquizz-mvp1` | TS, topics `nextjs supabase` | Patterns Supabase + Next | S'inspirer (supabase) |
| `PM-Chat` | TS | Patterns chat / OpenAI / messages | S'inspirer (prompts, messages) |
| `realtime-chat-supabase-react` | — | Realtime Supabase | Ignorer (hors MVP) |
| `techflow-agency` | TS, topic showcase | Landing premium, hero, cards | S'inspirer (landing) |
| `mabele-vision-craft` / `MATTDESIGN.AI` | TS | Génération visuelle / templates | S'inspirer (flyers) |
| `your-website-builder` | TS | Mini-sites, slug, vitrine | S'inspirer (public/[slug]) |
| `Lumia-` / `55secondes-` / `Signal99-` | TS | Design, expérience courte/virale | S'inspirer (UX) |
| `stripe-payment-app` | — | Paiement Stripe | Récupérer plus tard (J7) |
| `CRM-IMMO` / `Relayf` | TS | CRM léger, relances | S'inspirer (customers) |
| `LMNOX*` (agents, money, flowise) | TS/Py | Agents/automatisation lourde | Ignorer (sur-dimensionné pour le MVP) |
| `erpnext` | — | ERP complet | Ignorer (hors périmètre) |

**Risque commun** : ces repos mêlent prototypes et code montrable. Les importer
tels quels casserait la règle « ultra-épuré, stable, maintenable ». D'où la
reconstruction.

---

## Matrice de récupération (plan exécutable)

| Besoin LUMIVAO | Repo source probable | Brique visée | Action | Priorité |
|---|---|---|---|---|
| Landing premium | `techflow-agency` | hero / sections / cards | S'inspirer → déjà reconstruit | P1 ✅ |
| Wrapper OpenAI + fallback | `MABELE-CORE`, `PM-Chat` | `lib/ai`, prompts | Adapter → reconstruit (`src/lib/ai`) | P1 ✅ |
| Auth + client Supabase | `Init-SaaS`, `qquizz` | `lib/supabase` | Récupérer → stubs prêts (`src/lib/supabase`) | P1 |
| Design system Tailwind | `Lumia-`, `MATTDESIGN.AI` | tokens, boutons, cards | Reconstruire propre | P1 ✅ |
| QR | générique (`qrcode`) | `lib/qr` | Reconstruit (`src/lib/qr`, `/api/qr`) | P1 ✅ |
| Mini-vitrine publique | `your-website-builder` | slug, layout public | Reconstruit (`public/[slug]`) | P1 ✅ |
| Messages WhatsApp | `PM-Chat`, `CRM-IMMO` | templates, liens | Reconstruit (`lib/whatsapp`) | P1 ✅ |
| Flyer / export image | `mabele-vision-craft` | export PNG, templates | Reconstruit (`FlyerPreview`) | P1 ✅ |
| CRM / fidélité | `CRM-IMMO`, `Relayf` | fiches, relances | Reconstruit léger (`customers`) | P2 ✅ |
| Paiement | `stripe-payment-app` | Stripe checkout | Récupérer plus tard | P3 (J7) |
| Autopilot actions | `LMNOX*` (idées) | logique recommandations | Reconstruit local (`lib/autopilot`) | P2 ✅ |

✅ = déjà livré dans ce MVP (reconstruit proprement).

---

## Modules récupérés (esprit, pas le code)
Landing premium, design system, wrapper IA + fallback, QR, mini-vitrine,
WhatsApp, flyer export, CRM/fidélité léger, autopilot. Tous **réécrits** à la
charte LUMIVAO, en TypeScript strict.

## Modules ignorés (volontairement)
Agents LMNOX, Flowise, ERPNext, realtime chat, marketplace, automatisations
lourdes — hors périmètre d'un MVP « ultra-épuré, vendable en 7 jours ».

## Pour passer à la récupération réelle
Ajoutez au périmètre de session : `MABELE-CORE`, `Init-SaaS`, `techflow-agency`,
`your-website-builder`, `stripe-payment-app`. On pourra alors diff-er leurs
`lib/` et composants contre cette base et importer chirurgicalement.
