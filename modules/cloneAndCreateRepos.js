import { octokit, fs, simpleGit } from "./config.js";

async function cloneAndCreateRepos(org, username) {
  try {
    const data = await fs.readFile(`${org}_repos.json`, "utf8");
    const repos = JSON.parse(data);
    console.log(repos);

    for (const repo of repos) {
      const orgRepoUrl = `git@github.com:${org}/${repo}.git`;
      const dir = `./${org}/${repo}`;

      // on va créer une nouvelle instance de simple-git pour chaque repo
      const git = simpleGit();

      // On clone
      await git
        .clone(orgRepoUrl, dir)
        .then(() => console.log(`Repo ${repo} cloné localement`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors du clonage du repo ${repo}`,
            err
          )
        );

      // On créé un nouveau repo sur notre page Github
      await octokit.rest.repos
        .createForAuthenticatedUser({
          name: repo, // le nom du repo à créer
          private: false, // ou true si on veux que le repo soit privé mais non ^^
        })
        .then(() => console.log(`Repo ${repo} créé sur Github`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors de la création du repo ${repo}`,
            err
          )
        );

      // On fait un add . et un commit
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

      // On ajoute notre remote pour pouvoir pusher le repo avec upstream sur NOTRE page Github
      // On push sur notre la page de l'orga avec origin
      await git
        .addRemote("upstream", userRepoUrl)
        .then(() => console.log(`Remote ${userRepoUrl} ajouté`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors de l'ajout du remote ${userRepoUrl}`,
            err
          )
        );

      // On push chez nous... et finito
      await git
        .push("upstream", "master")
        .then(() => console.log(`Repo ${repo} pushé sur Github`))
        .catch((err) =>
          console.error(
            `Une erreur est survenue lors du push du repo ${repo} sur votre page Github`,
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

export default cloneAndCreateRepos;
