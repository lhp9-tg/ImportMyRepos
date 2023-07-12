// Dotenv est un module qui charge les variables d'environnement à partir d'un fichier .env dans process.env
import "dotenv/config.js";

// Octokit est un module qui permet d'interagir avec l'API Github
import { Octokit } from "octokit";

// simplegit est un module qui permet de manipuler les dépots git
import simpleGit from "simple-git";

import fs from "node:fs/promises";

// Se créer un token d'authentification grace à ce lien https://github.com/settings/tokens/new?scopes=repo
// Dans la partie select scopes, on coche repo et admin:org (pour avoir accès aux repos privées et pouvoir manipuler les dépots) et on génère le token
// et on le stocke dans un fichier .env
const octokit = new Octokit({ auth: `token ${process.env.tokenAPIGithub}` });

export { octokit, simpleGit, fs };
