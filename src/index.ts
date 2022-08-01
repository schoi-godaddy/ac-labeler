// Lib
import * as core from "@actions/core";
import * as github from "@actions/github";

// App
import { BaseParams, OctoClient } from "./api";
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

    const client = new OctoClient(github.getOctokit);

    let baseParams: BaseParams = { owner, repo, issue_number: issueNumber };

    // As per `action.yml` - If `minCompletedTaskCount` is not set,`minCompletedTaskPercentage` field is used.
    if (actionInputs.minCompletedTaskCount < 0) {
      if (body.percentCompleted >= actionInputs.minCompletedTaskPercentage) {
        await client.postLabel({ ...baseParams, labels: [actionInputs.label] });
        core.setOutput("labelAdded", true);
      } else {
        await client.postComment({
          ...baseParams,
          body:
            `Hi 👋, this Pull Request did not meet the minimum ${actionInputs.minCompletedTaskPercentage}% completed tasks requirement with ${body.percentCompleted}%. ` +
            `Label "${actionInputs.label}" was not added.`,
        });
      }
    } else {
      if (body.completed >= actionInputs.minCompletedTaskCount) {
        await client.postLabel({ ...baseParams, labels: [actionInputs.label] });
        core.setOutput("labelAdded", true);
      } else {
        await client.postComment({
          ...baseParams,
          body:
            `Hi 👋, this Pull Request did not meet the minimum ${actionInputs.minCompletedTaskCount} completed tasks requirement with ${body.completed}. ` +
            `Label "${actionInputs.label}" was not added.`,
        });
      }
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

export default run;
