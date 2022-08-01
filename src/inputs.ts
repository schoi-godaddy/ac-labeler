import { InputOptions } from "@actions/core";

export interface GitHubActionInputs {
  label: string;
  minCompletedTaskCount: number;
  minCompletedTaskPercentage: number;
}

/**
 * Get GitHub Action Inputs & parse into GitHubActionInputs object that can be used through out the app.
 * @param getInputFn Function which returns value to get.
 * @returns Parsed GitHubActionInputs.
 */
export const getInputs = (
  getInputFn: (name: string, options?: InputOptions) => string
): GitHubActionInputs => {
  const label = getInputFn("label", { required: true });
  const minCompTaskCount = getInputFn("minCompletedTaskCount");
  const minCompTaskPercentage = getInputFn("minCompletedTaskPercentage");

  return {
    label,
    minCompletedTaskCount: parseInt(minCompTaskCount) || -1,
    minCompletedTaskPercentage: parseInt(minCompTaskPercentage) || -1,
  };
};
