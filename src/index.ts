import core from "@actions/core";
import github from "@actions/github";

const run = async () => {
  try {
    const labelName = core.getInput("label");
    console.log(labelName);
    const time = new Date().toTimeString();
    core.setOutput("time", time);

    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN environment variable not found.");
    }

    const client = github.getOctokit(process.env.GITHUB_TOKEN);

    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events."
      );
    }

    const owner = contextPullRequest.base.user.login;
    const repo = contextPullRequest.base.repo.name;

    console.log(contextPullRequest);
  } catch (error: any) {
    core.setFailed(error);
  }
};

export default run;
