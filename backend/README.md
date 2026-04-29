# Backend StockBoutik

Ce dossier sert de base pour la future API `FastAPI` connectee a `MySQL`.

## Structure conseillee

```text
backend/
  app/
    main.py
    api/
      routes/
    core/
    models/
    schemas/
    services/
```

## Entites metier

- `Utilisateur`: comptes, roles, permissions, rattachement a une boutique
- `Produit`: reference, nom, prix, categorie, disponibilite
- `Vente`: transaction, montant, date, utilisateur, boutique
- `Stock`: quantite, seuil critique, mouvement, produit, boutique
- `Boutique`: nom, ville, adresse, statut

## API cible

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/produits`
- `GET /api/v1/ventes`
- `GET /api/v1/stocks/alertes`
- `GET /api/v1/boutiques`
- `GET /api/v1/utilisateurs`

Le front actuel du dossier `frontend/` a ete pense pour se brancher proprement sur ces routes.

## Lancement local

1. Installer les dependances:
   `pip install -r backend/requirements.txt`
2. Configurer les variables MySQL:
   `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`
3. Creer la base si elle n'existe pas encore:
   `CREATE DATABASE stockboutik;`
4. Lancer l'API:
   `uvicorn app.main:app --reload --app-dir backend`
5. Ouvrir l'application:
   `http://127.0.0.1:8000/`
6. Ouvrir la documentation API:
   `http://127.0.0.1:8000/docs`

## Liaison front/back

- Le frontend statique est servi par FastAPI via `/frontend`
- La racine `/` redirige vers `frontend/pages/index.html`
- `login.html` appelle `POST /api/v1/auth/login`
- `signin.html` appelle `POST /api/v1/auth/register`
- `dashboard.html` consomme:
  `GET /api/v1/produits`,
  `GET /api/v1/ventes`,
  `GET /api/v1/stocks/alertes`,
  `GET /api/v1/boutiques`,
  `GET /api/v1/utilisateurs`

## Deploiement Vercel

1. Pousser le depot sur GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement:
   `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`
4. Lancer le deploiement

Le frontend est prepare pendant le build dans `public/` via `build.py`.
Le point d'entree Python pour Vercel est `server.py`.
