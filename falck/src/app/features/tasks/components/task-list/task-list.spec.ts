import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Task, TaskDraft } from '../../../../core/models/task.model';
import { TaskService } from '../../data/task.service';
import { TaskListComponent } from './task-list';

const makeTask = (id: string): Task => ({
  id,
  title: `T${id}`,
  description: `D${id}`,
  dueDate: '2026-01-01',
  completed: false,
  stateHistory: [{ state: 'new', date: '2026-01-01' }],
  notes: ['n'],
});

interface Mock {
  getAll: () => Observable<Task[]>;
  update?: (id: string, patch: Partial<TaskDraft>) => Observable<Task>;
  remove?: (id: string) => Observable<void>;
}

const setup = (mock: Mock) => {
  TestBed.configureTestingModule({
    imports: [TaskListComponent],
    providers: [{ provide: TaskService, useValue: { update: () => of(), remove: () => of(void 0), ...mock } }],
  });
  return TestBed.createComponent(TaskListComponent);
};

describe('TaskListComponent', () => {
  it('shows empty state when loaded list is empty', () => {
    const fixture = setup({ getAll: () => of([]) });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No hay tareas');
  });

  it('renders one app-task per paged task and paginates to 5', () => {
    const tasks = Array.from({ length: 7 }, (_, i) => makeTask(String(i + 1)));
    const fixture = setup({ getAll: () => of(tasks) });
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('app-task').length).toBe(5);
    expect(host.textContent).toContain('Pagina 1 de 2');
  });

  it('advances page when next button is clicked', () => {
    const tasks = Array.from({ length: 7 }, (_, i) => makeTask(String(i + 1)));
    const fixture = setup({ getAll: () => of(tasks) });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const next = Array.from(host.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Siguiente',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    expect(host.querySelectorAll('app-task').length).toBe(2);
    expect(host.textContent).toContain('Pagina 2 de 2');
  });
});
