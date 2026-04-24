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
    providers: [
      {
        provide: TaskService,
        useValue: { update: () => of(), remove: () => of(void 0), ...mock },
      },
    ],
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
    expect(host.querySelectorAll('.task-list__pager-btn--num').length).toBe(2);
  });

  it('advances to the clicked page number', () => {
    const tasks = Array.from({ length: 7 }, (_, i) => makeTask(String(i + 1)));
    const fixture = setup({ getAll: () => of(tasks) });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const page2 = Array.from(host.querySelectorAll<HTMLButtonElement>('.task-list__pager-btn--num')).find(
      (b) => b.textContent?.trim() === '2',
    );
    page2?.click();
    fixture.detectChanges();

    expect(host.querySelectorAll('app-task').length).toBe(2);
    const active = host.querySelector('.task-list__pager-btn--num.is-active');
    expect(active?.textContent?.trim()).toBe('2');
  });
});
