// Lib
import * as core from "@actions/core";
import * as github from "@actions/github";

// App
import { parsePullRequestContext, PullRequestContext } from "./utils";
import { getInputs, GitHubActionInputs } from "./inputs";

/**
 * Main application.
 */
const run = async () => {
  try {
    core.setOutput("labelAdded", false);
    const actionInputs: GitHubActionInputs = getInputs(core.getInput);
    const { owner, repo, issueNumber, body }: PullRequestContext =
      parsePullRequestContext(github.context.payload);

    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN environment variable not found.");
    }
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    // As per `action.yml` - If `minCompletedTaskCount` is not set,`minCompletedTaskPercentage` field is used.
    if (actionInputs.minCompletedTaskCount < 0) {
      if (body.percentCompleted >= actionInputs.minCompletedTaskPercentage) {
        await octokit.request(
          "POST /repos/:owner/:repo/issues/:issue_number/labels",
          {
            owner,
            repo,
            issue_number: issueNumber,
            labels: [actionInputs.label],
          }
        );
        core.setOutput("labelAdded", true);
      } else {
        await octokit.request(
          "POST /repos/:owner/:repo/issues/:issue_number/comments",
          {
            owner,
            repo,
            issue_number: issueNumber,
            body:
              `Hi 👋, this Pull Request did not meet the minimum ${actionInputs.minCompletedTaskPercentage}% completed tasks requirement with ${body.percentCompleted}%.` +
              `Label ${actionInputs.label} was not added.`,
          }
        );
      }
    } else {
      if (body.completed >= actionInputs.minCompletedTaskCount) {
        await octokit.request(
          "POST /repos/:owner/:repo/issues/:issue_number/labels",
          {
            owner,
            repo,
            issue_number: issueNumber,
            labels: [actionInputs.label],
          }
        );
        core.setOutput("labelAdded", true);
      } else {
        await octokit.request(
          "POST /repos/:owner/:repo/issues/:issue_number/comments",
          {
            owner,
            repo,
            issue_number: issueNumber,
            body:
              `Hi 👋, this Pull Request did not meet the minimum ${actionInputs.minCompletedTaskCount} completed tasks requirement with ${body.completed}.` +
              `Label ${actionInputs.label} was not added.`,
          }
        );
      }
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

export default run;
