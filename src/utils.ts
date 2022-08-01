import { WebhookPayload } from "@actions/github/lib/interfaces";

export interface PullRequestContext {
  owner: string;
  repo: string;
  issueNumber: number;
  body: BodyDetails;
}

/**
 * Parse GitHub WebhookPayload to PullRequestContext object that can be used through out the app.
 * @param payload Github WebhookPayload Object, expect to contain `pull_request` key/val.
 * @returns PullRequestContext object, if not `pull_request` throws Error.
 */
export const parsePullRequestContext = (
  payload: WebhookPayload
): PullRequestContext => {
  const contextPullRequest = payload.pull_request;
  if (!contextPullRequest) {
    throw new Error(
      "This action can only be invoked in `pull_request_target` or `pull_request` events."
    );
  }

  const owner = contextPullRequest.base.user.login;
  const repo = contextPullRequest.base.repo.name;
  const bodyDetails = parseBody(contextPullRequest.body || "");
  console.log("bodyDetails", bodyDetails);
  const issueNumber = contextPullRequest.number;

  return {
    owner,
    repo,
    issueNumber,
    body: bodyDetails,
  };
};

interface BodyDetails {
  total: number;
  todo: number;
  completed: number;
  percentCompleted: number;
}

/**
 * Parse body of string which may contain series of `[ ]` or `[x]`, then returns BodyDetails object that can be used through out the app.
 * @param body Body of a Pull Request.
 * @returns BodyDetails object containing detailed info about `[ ]` and/or `[x]` usage.
 */
const parseBody = (body: string): BodyDetails => {
  const todos = body.match(/\[.?\]/g) || [];
  const total = todos.length;
  let completed = 0;
  let todo = 0;
  let percentCompleted = 100;

  // https://docs.github.com/en/issues/tracking-your-work-with-issues/about-task-lists#creating-task-lists
  todos.forEach((item) => {
    if (item === "[x]") {
      todo++;
    } else {
      completed++;
    }
  });

  if (total != 0) {
    percentCompleted = Math.round((completed / total) * 100);
  }

  return {
    total,
    todo,
    completed,
    percentCompleted,
  };
};
