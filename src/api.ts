import { GitHub } from "@actions/github/lib/utils";
import { RequestParameters } from "@octokit/types/dist-types/RequestParameters";
import { OctokitOptions } from "@octokit/core/dist-types/types";

export interface BaseParams extends RequestParameters {
  owner: string;
  repo: string;
  issue_number: number;
}

interface PostLabelParams extends BaseParams {
  labels: string[];
}

interface PostCommentParams extends BaseParams {
  body: string;
}

/**
 * Octokit API Wrapper class.
 */
export class OctoClient {
  private octokit: InstanceType<typeof GitHub>;

  constructor(
    oktoKitFn: (
      token: string,
      options?: OctokitOptions
    ) => InstanceType<typeof GitHub>
  ) {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN environment variable not found.");
    }
    this.octokit = oktoKitFn(process.env.GITHUB_TOKEN);
  }

  // https://docs.github.com/en/rest/issues/labels#add-labels-to-an-issue
  postLabel(params: PostLabelParams): Promise<unknown> {
    return this.octokit.request(
      "POST /repos/:owner/:repo/issues/:issue_number/labels",
      params
    );
  }

  // https://docs.github.com/en/rest/issues/comments#create-an-issue-comment
  postComment(params: PostCommentParams): Promise<unknown> {
    return this.octokit.request(
      "POST /repos/:owner/:repo/issues/:issue_number/comments",
      params
    );
  }
}
