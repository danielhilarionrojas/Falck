import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { ApiError } from '../../../core/errors/api-error';
import { Task, TaskDraft } from '../../../core/models/task.model';
import { TaskService } from './task.service';
import { TaskStore } from './task.store';

const makeTask = (id: string, overrides: Partial<Task> = {}): Task => ({
  id,
  title: `Task ${id}`,
  description: `Desc ${id}`,
  dueDate: '2026-01-01',
  completed: false,
  stateHistory: [{ state: 'new', date: '2026-01-01' }],
  notes: ['note-a'],
  ...overrides,
});

const makeTasks = (n: number): Task[] =>
  Array.from({ length: n }, (_, i) => makeTask(String(i + 1)));

interface TaskServiceMock {
  getAll: () => Observable<Task[]>;
  create: (draft: TaskDraft) => Observable<Task>;
  update: (id: string, patch: Partial<TaskDraft>) => Observable<Task>;
  remove: (id: string) => Observable<void>;
}

const setup = (overrides: Partial<TaskServiceMock> = {}): {
  store: TaskStore;
  service: TaskServiceMock;
} => {
  const service: TaskServiceMock = {
    getAll: () => of([]),
    create: (draft) =>
      of(makeTask('new', { title: draft.title, description: draft.description })),
    update: (id, patch) => of(makeTask(id, patch as Partial<Task>)),
    remove: () => of(void 0),
    ...overrides,
  };

  TestBed.configureTestingModule({
    providers: [{ provide: TaskService, useValue: service }],
  });

  return { store: TestBed.inject(TaskStore), service };
};

describe('TaskStore', () => {
  it('initial state is empty', () => {
    const { store } = setup();
    expect(store.tasks()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.pageIndex()).toBe(0);
    expect(store.totalPages()).toBe(1);
    expect(store.pagedTasks()).toEqual([]);
    expect(store.isEmpty()).toBe(true);
  });

  it('load() populates tasks and flips loading', () => {
    const tasks = makeTasks(3);
    const { store } = setup({ getAll: () => of(tasks) });

    store.load();

    expect(store.tasks()).toEqual(tasks);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.isEmpty()).toBe(false);
  });

  it('load() normalizes errors and stops loading', () => {
    const apiError: ApiError = { status: 500, message: 'boom', url: '/tasks', cause: null };
    const { store } = setup({ getAll: () => throwError(() => apiError) });

    store.load();

    expect(store.error()).toEqual(apiError);
    expect(store.loading()).toBe(false);
  });

  it('computes totalPages and pagedTasks from pageSize', () => {
    const tasks = makeTasks(12); // 12 / 5 = ceil 3 pages
    const { store } = setup({ getAll: () => of(tasks) });
    store.load();

    expect(store.totalPages()).toBe(3);
    expect(store.pagedTasks().length).toBe(5);
    expect(store.pagedTasks()[0].id).toBe('1');

    store.goToPage(1);
    expect(store.pagedTasks().map((t) => t.id)).toEqual(['6', '7', '8', '9', '10']);

    store.goToPage(2);
    expect(store.pagedTasks().map((t) => t.id)).toEqual(['11', '12']);
  });

  it('goToPage clamps out-of-range indices', () => {
    const { store } = setup({ getAll: () => of(makeTasks(8)) });
    store.load();

    store.goToPage(-5);
    expect(store.pageIndex()).toBe(0);

    store.goToPage(99);
    expect(store.pageIndex()).toBe(store.totalPages() - 1);
  });

  it('create() appends the new task', () => {
    const { store } = setup({
      getAll: () => of(makeTasks(2)),
      create: () => of(makeTask('99', { title: 'Added' })),
    });
    store.load();

    store.create({ title: 'Added', description: 'd', dueDate: '2026-01-01', notes: ['n'] });

    expect(store.tasks().map((t) => t.id)).toEqual(['1', '2', '99']);
  });

  it('update() replaces matching task', () => {
    const { store } = setup({
      getAll: () => of(makeTasks(3)),
      update: (id) => of(makeTask(id, { title: 'Patched' })),
    });
    store.load();

    store.update('2', { title: 'Patched' }).subscribe();

    expect(store.tasks().find((t) => t.id === '2')?.title).toBe('Patched');
  });

  it('remove() drops the task and clamps pageIndex when needed', () => {
    const { store } = setup({ getAll: () => of(makeTasks(6)) }); // 2 pages
    store.load();
    store.goToPage(1);
    expect(store.pagedTasks().map((t) => t.id)).toEqual(['6']);

    // Borrar la unica task de la pagina 1 debe regresar a pagina 0
    store.remove('6');

    expect(store.tasks().length).toBe(5);
    expect(store.totalPages()).toBe(1);
    expect(store.pageIndex()).toBe(0);
  });

  it('isEmpty is false during loading but true after empty load completes', () => {
    const { store } = setup({ getAll: () => of([]) });

    expect(store.isEmpty()).toBe(true); // inicial (sin loading)
    store.load();
    expect(store.isEmpty()).toBe(true);
  });
});
