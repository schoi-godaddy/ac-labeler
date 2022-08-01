// Lib
import * as core from "@actions/core";
import * as github from "@actions/github";

// App
import { breakdownBody } from "./utils";
import { getInputs, GitHubActionInputs } from "./inputs";

const run = async () => {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events."
      );
    }
    const owner = contextPullRequest.base.user.login;
    const repo = contextPullRequest.base.repo.name;
    const body = breakdownBody(contextPullRequest.body || "");

    console.log(body);

    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN environment variable not found.");
    }
    const client = github.getOctokit(process.env.GITHUB_TOKEN);
    const inputs: GitHubActionInputs = getInputs(core.getInput);

    // await client.request(
    //   "POST /repos/:owner/:repo/issues/:issue_number/comments",
    //   {
    //     owner,
    //     repo,
    //     issue_number: contextPullRequest.number,
    //     body: `Hello 👋  `,
    //   }
    // );

    console.log(inputs);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

export default run;
