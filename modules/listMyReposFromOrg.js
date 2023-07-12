import { octokit, fs } from "./config.js";

async function listMyReposFromOrg(org, username) {
  // On récupère les repos de l'organisation dont le nom est passé en paramètre et qui contient le nom d'utilisateur
  try {
    const { data } = await octokit.rest.repos.listForOrg({
      org,
      type: "all", // on peut utiliser 'all', 'private', 'public', 'forks', 'sources', ou 'member'
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

export default listMyReposFromOrg;
