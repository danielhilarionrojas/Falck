import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Task, TaskDraft } from '../../../../core/models/task.model';
import { TaskStore } from '../../data/task.store';
import { TaskFormComponent } from '../../components/task-form/task-form';
import { TaskListComponent } from '../../components/task-list/task-list';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskFormComponent, TaskListComponent],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TasksPageComponent {
  private readonly store = inject(TaskStore);

  protected readonly editing = signal<Task | null>(null);

  protected onSubmit(draft: TaskDraft): void {
    const target = this.editing();
    if (target) {
      this.store.update(target.id, draft).subscribe({
        next: () => this.editing.set(null),
      });
    } else {
      this.store.create(draft);
    }
  }

  protected onEditRequested(task: Task): void {
    this.editing.set(task);
    queueMicrotask(() => {
      const el = document.getElementById('task-form-pane');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  protected onCancel(): void {
    this.editing.set(null);
  }
}
