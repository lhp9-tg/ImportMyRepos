import { octokit } from "./modules/config.js";
import listMyReposFromOrg from "./modules/listMyReposFromOrg.js";
import cloneAndCreateRepos from "./modules/cloneAndCreateRepos.js";

// Fonction créé par chatGPT pour attendre que listMyReposFromOrg se termine avant de lancer cloneAndCreateRepos
(async function main() {
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

  // Appel de la fonction listMyReposFromOrg
  await listMyReposFromOrg(orgReact, username);

  // Appel de la fonction cloneAndCreateRepos
  await cloneAndCreateRepos(orgReact, username);
})();
