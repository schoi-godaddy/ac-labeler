export interface BodyBreakdown {
  total: number;
  todo: number;
  completed: number;
  percentage: number;
}

export const breakdownBody = (body: string): BodyBreakdown => {
  const todos = body.match(/\[.?\]/g) || [];
  const total = todos.length;
  let completed = 0;
  let todo = 0;
  let percentage = 100;

  // https://docs.github.com/en/issues/tracking-your-work-with-issues/about-task-lists#creating-task-lists
  todos.forEach((item) => {
    if (item === "[x]") {
      todo++;
    } else {
      completed++;
    }
  });

  if (total != 0) {
    percentage = Math.round((completed / total) * 100);
  }

  return {
    total,
    todo,
    completed,
    percentage,
  };
};
