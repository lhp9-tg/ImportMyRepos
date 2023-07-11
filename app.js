import dotenv from 'dotenv';
dotenv.config();
import { Octokit, App } from "octokit";
import { writeFile } from "node:fs/promises";


// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: `token ${process.env.tokenAPIGithub}` });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

const orgWatt = 'O-Clock-Watt';
const orgReact = 'O-clock-Watt-Webb-react';

const username = 'Anthony'; 

async function listReposForOrg(org) {
    try {
      const { data } = await octokit.rest.repos.listForOrg({
        org,
        type: 'all', // vous pouvez utiliser 'all', 'private', 'public', 'forks', 'sources', ou 'member'
      });

      const repoNames = data
      .map((repo) => repo.name)
      .filter((name) => name.includes(username));
      
      try {
        await writeFile(`${org}_repos.json`, JSON.stringify(repoNames, null, 2));
        console.log(`Repositories for ${org} containing "${username}" written to ${org}_repos.json`);
      } catch (err) {
        console.error('An error occurred while writing the file', err);
      }

    } catch (err) {
      console.error(`An error occurred while fetching the repos for ${org}`, err);
    }
  }

  listReposForOrg(orgWatt);
  listReposForOrg(orgReact);


