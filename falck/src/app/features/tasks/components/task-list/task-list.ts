import { ChangeDetectionStrategy, Component, OnInit, inject, output } from '@angular/core';

import { Task } from '../../../../core/models/task.model';
import { TaskStore } from '../../data/task.store';
import { TaskComponent } from '../task/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  protected readonly store = inject(TaskStore);

  readonly editRequested = output<Task>();

  ngOnInit(): void {
    this.store.load();
  }

  protected onToggle(task: Task): void {
    this.store.update(task.id, { completed: !task.completed }).subscribe();
  }

  protected onRemove(id: Task['id']): void {
    this.store.remove(id);
  }

  protected onEdit(task: Task): void {
    this.editRequested.emit(task);
  }
}
