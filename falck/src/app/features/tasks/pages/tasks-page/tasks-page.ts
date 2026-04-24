import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TaskDraft } from '../../../../core/models/task.model';
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

  protected onSubmit(draft: TaskDraft): void {
    this.store.create(draft);
  }
}
