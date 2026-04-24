import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiError } from '../../../core/errors/api-error';
import { Task, TaskDraft } from '../../../core/models/task.model';
import { TaskService } from './task.service';

const PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly service = inject(TaskService);

  private readonly _tasks = signal<readonly Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);
  private readonly _pageIndex = signal<number>(0);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pageIndex = this._pageIndex.asReadonly();
  readonly pageSize = PAGE_SIZE;

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this._tasks().length / PAGE_SIZE)),
  );

  readonly pagedTasks = computed<readonly Task[]>(() => {
    const start = this._pageIndex() * PAGE_SIZE;
    return this._tasks().slice(start, start + PAGE_SIZE);
  });

  readonly isEmpty = computed(() => !this._loading() && this._tasks().length === 0);

  readonly pageNumbers = computed<readonly number[]>(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.service.getAll().subscribe({
      next: (tasks) => this._tasks.set(tasks),
      error: (err: ApiError) => {
        this._error.set(err);
        this._loading.set(false);
      },
      complete: () => this._loading.set(false),
    });
  }

  goToPage(index: number): void {
    const clamped = Math.min(Math.max(0, index), this.totalPages() - 1);
    this._pageIndex.set(clamped);
  }

  nextPage(): void {
    this.goToPage(this._pageIndex() + 1);
  }

  prevPage(): void {
    this.goToPage(this._pageIndex() - 1);
  }

  create(draft: TaskDraft): void {
    this._error.set(null);
    this.service.create(draft).subscribe({
      next: (task) => this._tasks.update((list) => [...list, task]),
      error: (err: ApiError) => this._error.set(err),
    });
  }

  update(id: Task['id'], patch: Partial<TaskDraft>): Observable<Task> {
    this._error.set(null);
    return this.service.update(id, patch).pipe(
      tap({
        next: (updated) =>
          this._tasks.update((list) => list.map((t) => (t.id === id ? updated : t))),
        error: (err: ApiError) => this._error.set(err),
      }),
    );
  }

  remove(id: Task['id']): void {
    this._error.set(null);
    this.service.remove(id).subscribe({
      next: () => {
        this._tasks.update((list) => list.filter((t) => t.id !== id));
        if (this._pageIndex() > this.totalPages() - 1) {
          this._pageIndex.set(this.totalPages() - 1);
        }
      },
      error: (err: ApiError) => this._error.set(err),
    });
  }

  dismissError(): void {
    this._error.set(null);
  }
}
