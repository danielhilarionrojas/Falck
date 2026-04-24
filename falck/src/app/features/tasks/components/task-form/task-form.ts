import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TaskDraft } from '../../../../core/models/task.model';
import { minLengthArray } from '../../../../shared/validators/min-length-array.validator';

interface TaskFormShape {
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<string>;
  notes: FormArray<FormControl<string>>;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly submitted = output<TaskDraft>();

  protected readonly form: FormGroup<TaskFormShape> = this.fb.group<TaskFormShape>({
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    description: this.fb.control('', { validators: [Validators.required] }),
    dueDate: this.fb.control('', { validators: [Validators.required] }),
    notes: this.fb.array<FormControl<string>>(
      [this.newNoteControl()],
      { validators: [minLengthArray(1)] },
    ),
  });

  protected get notes(): FormArray<FormControl<string>> {
    return this.form.controls.notes;
  }

  protected addNote(): void {
    this.notes.push(this.newNoteControl());
  }

  protected removeNote(index: number): void {
    if (this.notes.length <= 1) return;
    this.notes.removeAt(index);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({
      title: value.title.trim(),
      description: value.description.trim(),
      dueDate: value.dueDate,
      notes: value.notes.map((n) => n.trim()),
    });
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset();
    this.notes.clear();
    this.notes.push(this.newNoteControl());
  }

  private newNoteControl(): FormControl<string> {
    return this.fb.control('', { validators: [Validators.required, Validators.minLength(1)] });
  }
}
