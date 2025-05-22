import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class PhotoUploadComponent {
  @Output() photoFormSubmitted = new EventEmitter<FormData>();

  form: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      note: [''],
      category: [''],
      file: [null, Validators.required],
      takenDate: [this.getTodayDate(), Validators.required],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ file: this.selectedFile });
    }
  }

  submit() {
    console.log('📤 Botón de subir fue presionado');
    if (this.form.invalid || !this.selectedFile) {
      console.log('❌ Formulario inválido o archivo no seleccionado');
      return;
    }
    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('note', this.form.value.note);
    formData.append('category', this.form.value.category);
    formData.append('file', this.selectedFile);
    formData.append('takenDate', this.form.value.takenDate);

    console.log('✅ takenDate enviado:', this.form.value.takenDate);
    this.photoFormSubmitted.emit(formData);

    // Reset con valor por defecto para takenDate
    this.form.reset({
      title: '',
      note: '',
      category: '',
      file: null,
      takenDate: this.getTodayDate()
    });
    this.selectedFile = null;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
  }
}