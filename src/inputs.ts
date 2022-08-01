import { InputOptions } from "@actions/core";

export interface GitHubActionInputs {
  label: string;
  minCompletedTaskCount: number;
  minCompletedTaskPercentage: number;
}

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
