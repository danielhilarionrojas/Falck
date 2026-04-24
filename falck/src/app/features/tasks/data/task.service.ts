import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Task, TaskDraft, TaskState } from '../../../core/models/task.model';
import { API_BASE_URL } from '../../../core/tokens/api-base-url.token';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  getById(id: Task['id']): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  create(draft: TaskDraft): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, draft);
  }

  update(id: Task['id'], patch: Partial<TaskDraft>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, patch);
  }

  remove(id: Task['id']): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  getStates(): Observable<TaskState[]> {
    return this.http.get<TaskState[]>(`${this.baseUrl}/states`);
  }
}
