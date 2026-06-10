# Déploiement Vercel — LUMIVAO

Tout est déjà prêt dans le repo : `vercel.json`, `.vercelignore` et un pipeline
d'auto-déploiement (`.github/workflows/deploy-vercel.yml`). Il reste **une seule
action** côté Vercel (impossible à automatiser sans identifiants).

---

## Option A — Import en 1 clic (recommandé, ~60 s)

1. Allez sur **https://vercel.com/new**.
2. **Import** le repo GitHub `peupleaelionor/Lumivao`.
3. Vercel détecte Next.js automatiquement — laissez les réglages par défaut.
4. (Optionnel) **Environment Variables** → ajoutez celles dont vous avez besoin :
   ```
   NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
   OPENAI_API_KEY=...            # sinon : repli local automatique
   OPENAI_MODEL=gpt-4o-mini
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   DATABASE_URL=...
   ```
   > Le MVP **build et tourne sans aucune variable** (mode démo localStorage).
5. **Deploy.** À chaque `git push`, Vercel redéploie automatiquement.

C'est le « lancement automatique » : une fois importé, chaque push déploie seul.

---

## Option B — Auto-déploiement via GitHub Actions

Si vous préférez piloter le déploiement depuis CI (déjà câblé) :

1. Créez un token : **https://vercel.com/account/tokens**.
2. Liez le projet une fois en local :
   ```bash
   npm i -g vercel
   vercel link        # crée .vercel/project.json (orgId + projectId)
   ```
3. Dans GitHub → **Settings → Secrets and variables → Actions**, ajoutez :
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`      (depuis `.vercel/project.json`)
   - `VERCEL_PROJECT_ID`  (depuis `.vercel/project.json`)
4. Poussez : le workflow déploie en **preview** sur les branches `claude/**` et
   en **production** sur `main`.

---

## Option C — Déploiement manuel en ligne de commande

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

---

## Vérifications post-déploiement

- [ ] La landing `/` s'affiche (charte crème/noir/vert).
- [ ] `/app/onboarding` crée un commerce.
- [ ] `/app/today` génère 3 offres + supports.
- [ ] `GET /api/qr?data=https://exemple.com&size=240` renvoie un PNG.
- [ ] Réglez `NEXT_PUBLIC_APP_URL` sur le domaine final (liens & QR partageables).

> Note : ce conteneur de build n'a pas accès au réseau Vercel (token absent,
> `vercel.com` renvoie 403). Le déploiement se fait donc via l'une des options
> ci-dessus, depuis votre compte Vercel.
