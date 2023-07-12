// Se crée un token d'authentification grace à ce lien https://github.com/settings/tokens/new?scopes=repo
// Dans la partie select scopes, on coche repo et admin:org (pour avoir accès aux repos privées et pouvoir manipuler les dépots) et on génère le token
// et on le stocke dans un fichier .env
const octokit = new Octokit({ auth: `token ${process.env.tokenAPIGithub}` });

// Dotenv est un module qui charge les variables d'environnement à partir d'un fichier .env dans process.env
import "dotenv/config.js";

// Octokit est un module qui permet d'interagir avec l'API Github
import { Octokit, App } from "octokit";

// simplegit est un module qui permet de manipuler les dépots git
import simpleGit from "simple-git";

import fs from "node:fs/promises";

// On récupère le nom de l'utilisateur connecté
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Bonjour, %s", login);

// On définit les organisations dont on veut récupérer les repos
// const orgWatt = "O-Clock-Watt";
const orgReact = "O-clock-Watt-Webb-react";

// On définit le nom d'utilisateur dont on veut récupérer les repos
const username = login;

async function listMyReposFromOrg(org) {
  // On récupère les repos de l'organisation dont le nom est passé en paramètre et qui contient le nom d'utilisateur
  try {
    const { data } = await octokit.rest.repos.listForOrg({
      org,
      type: "all", // vous pouvez utiliser 'all', 'private', 'public', 'forks', 'sources', ou 'member'
    });
    console.log(data);

    const repoNames = data
      .map((repo) => repo.name)
      .filter((name) => name.includes(username));

    // On écrit les noms des repos dans un fichier JSON
    try {
      await writeFile(`${org}_repos.json`, JSON.stringify(repoNames, null, 2));
      console.log(
        `Les repos de l'organisation ${org} qui contiennent le nom d'utilisateur "${username}" ont été ecrit dansd le fichier ${org}_repos.json`
      );
    } catch (err) {
      console.error("Erreur lors de l'ecriture des repos dans le JSON", err);
    }
  } catch (err) {
    console.error(
      `Une erreur est survenue lors du parcours du repo ${org}`,
      err
    );
  }
}

async function cloneAndCreateRepos(org, username) {
  try {
    const data = await fs.readFile(`${org}_repos.json`, "utf8");
    const repos = JSON.parse(data);
    console.log(repos);

    for (const repo of repos) {
      const orgRepoUrl = `git@github.com:${org}/${repo}.git`;
      const dir = `./${org}/${repo}`; // Le répertoire de clone doit être spécifique à chaque repo

      // Créer une nouvelle instance de simple-git pour chaque repo
      const git = simpleGit();

      // Cloner le repo
      await git
        .clone(orgRepoUrl, dir)
        .then(() => console.log(`Repo ${repo} cloné localement`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors du clonage du repo ${repo}`,
            err
          )
        );

      // Créer le nouveau repo sur votre page Github
      await octokit.rest.repos
        .createForAuthenticatedUser({
          name: repo, // le nom du repo à créer
          private: false, // ou true si vous voulez que le repo soit privé
        })
        .then(() => console.log(`Repo ${repo} créé sur Github`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors de la création du repo ${repo}`,
            err
          )
        );

      // Ajouter les modifications à l'index git et faire un commit
      await git
        .add(".")
        .commit("Initial commit")
        .then(() =>
          console.log(`Modifications ajoutées et commit effectué pour ${repo}`)
        )
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors de l'ajout et du commit des modifications pour ${repo}`,
            err
          )
        );

      const userRepoUrl = `git@github.com:${username}/${repo}.git`;

      // Ajouter le remote du nouveau repo sur votre page Github
      await git
        .addRemote("upstream", userRepoUrl)
        .then(() => console.log(`Remote ${userRepoUrl} ajouté`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors de l'ajout du remote ${userRepoUrl}`,
            err
          )
        );

      // Pusher le repo sur votre page Github
      await git
        .push("origin", "master")
        .then(() => console.log(`Repo ${repo} pushé sur Github`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors du push du repo ${repo}`,
            err
          )
        );
    }
  } catch (err) {
    console.error(
      `Une erreur est survenue lors du parcours du repo ${org}`,
      err
    );
  }
}

// listMyReposFromOrg(orgWatt);
// listMyReposFromOrg(orgReact);
cloneAndCreateRepos(orgReact, username);
