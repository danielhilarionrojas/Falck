import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { Task, currentState } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task',
  imports: [DatePipe],
  templateUrl: './task.html',
  styleUrl: './task.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  readonly task = input.required<Task>();

  readonly toggleComplete = output<Task['id']>();
  readonly edit = output<Task>();
  readonly remove = output<Task['id']>();

  protected readonly expanded = signal(false);
  protected readonly state = computed(() => currentState(this.task()));

  protected toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }
}
