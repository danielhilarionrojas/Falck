export type TaskStateName = 'new' | 'active' | 'resolved' | 'closed';

export interface TaskStateTransition {
  readonly state: TaskStateName;
  readonly date: string;
}

export interface TaskState {
  readonly id: string;
  readonly name: TaskStateName;
}

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly dueDate: string;
  readonly completed: boolean;
  readonly stateHistory: readonly TaskStateTransition[];
  readonly notes: readonly string[];
}

export type TaskDraft = Omit<Task, 'id' | 'stateHistory' | 'completed'> & {
  readonly completed?: boolean;
};

export const currentState = (task: Task): TaskStateName =>
  task.stateHistory.at(-1)?.state ?? 'new';
