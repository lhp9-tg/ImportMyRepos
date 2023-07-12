# Petit projet pour récupérer les repos situés sur les repos de O'Clock et ramener à la maison

## A qui ça sert ?

Si :

- vous voulez récupérer vos repos sur les pages GitHub d'O'Clock pour travailler dessus,
- faire des commits sur votre propre compte pour booster vos stats,
- rapatrier des projets dont vous êtes fiers et les exposer sur votre espace GitHub (qui sera probablement sur votre CV, vu par des recruteurs...)

Et cela de façon automatisée

> Sinon vous pouvez aussi les cloner à la main un par un...

## Le script nécessite pour tourner :

- vite avec vanilla JS et JS
- Dotenv est un module qui charge les variables d'environnement à partir d'un fichier .env dans process.env
- Octokit est un module qui permet d'interagir avec l'API Github
- Simple-git est un module qui permet de manipuler les dépots git

> Donc avec yarn :

```bash
yarn create vite
cd ./LE_NOM_DU_PROJET
yarn add octokit
yarn add dotenv
yarn add simple-git
```

## !!! Pour lancer le script !!!

il faut se créer un token d'authentification grace à ce lien https://github.com/settings/tokens/new?scopes=repo

- Si cela n'est pas fait, on se met bien sur "New personal access token (classic)".
- On ajoute une note (par exemple : ImportMyRepos).
- Dans la partie select scopes, on coche repo et read:org dans admin:org (pour avoir accès aux repos privées et pouvoir manipuler les dépots) et on génère le token en cliquant sur le bouton en bas de page...
- ... et on le stocke dans le fichier .env situé à la racine du projet (ATTENTION sur GitHub vous ne pouvez pas revenir pour récupérer votre token).

### C'est cette clé PAT (Personal Acces Token) qui vous identifie dans l'API donc pas de login / mot de passe ensuite. Pratique !

Ne donner votre clé à personne.
Si vous perdez votre clé, il faudra en générer un autre via la procédure décrite plus haut et supprimer la clé perdue.

> Pour lancer le script, faire simplement dans votre terminal à la racine du projet :

```bash
node main.js
```

Le script va créer alors un dossier pour l'organisation GitHub dans lequel il va créer des dossiers pour chaque repos qui porte votre nom.
Ensuite il va les clone.

Le script va ensuite créer les repos sur votre GitHub perso, ajouter une remote avec l'url de votre GitHub, add, commit et push tous les repos.

## Choisir son repo O'Clock

Il suffit d'ajouter une constante dans main.js

```js
// main.js

// On définit les organisations dont on veut récupérer les repos
const orgWatt = "O-Clock-Watt";
const orgReact = "O-clock-Watt-Webb-react";
// Vous pouvez evidement en ajouter.....
```

Ensuite ça se passe quelques lignes plus bas :

```js
// main.js

// Appel de la fonction listMyReposFromOrg
// Création de la liste de vos repos présents dans l'organisation O'Clock et ecriture dans le JSON du même nom
await listMyReposFromOrg(orgWatt, username);
await listMyReposFromOrg(orgReact, username);
// Vous pouvez evidement en lancer d'autres....

// Appel de la fonction cloneAndCreateRepos
// "Clonage" des fichiers dans le JSON, création des repos sur votre GitHub perso, add., commit et push dans vos repos
await cloneAndCreateRepos(orgWatt, username);
await cloneAndCreateRepos(orgReact, username);
// Vous pouvez évidement en lancer d'autre
```

> Enjoy !

Pour les mails : thomas.gouel@oclock.school
