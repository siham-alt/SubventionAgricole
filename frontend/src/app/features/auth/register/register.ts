import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { REGIONS_MAROC, Region, Province } from '../../../core/data/regions-maroc';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  regions = REGIONS_MAROC;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cin: ['', Validators.required],
    telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    region: ['', Validators.required],
    province: [{ value: '', disabled: true }, Validators.required],
    commune: [{ value: '', disabled: true }, Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  });

  // Provinces disponibles selon la région choisie
  get availableProvinces(): Province[] {
    const regionNom = this.form.get('region')?.value;
    const region = this.regions.find(r => r.nom === regionNom);
    return region ? region.provinces : [];
  }

  // Communes disponibles selon la province choisie
  get availableCommunes(): string[] {
    const provinceNom = this.form.get('province')?.value;
    const province = this.availableProvinces.find(p => p.nom === provinceNom);
    return province ? province.communes : [];
  }

  onRegionChange(): void {
    this.form.patchValue({ province: '', commune: '' });
    const provinceControl = this.form.get('province');
    if (this.form.get('region')?.value) {
      provinceControl?.enable();
    } else {
      provinceControl?.disable();
    }
    this.form.get('commune')?.disable();
  }

  onProvinceChange(): void {
    this.form.patchValue({ commune: '' });
    const communeControl = this.form.get('commune');
    if (this.form.get('province')?.value) {
      communeControl?.enable();
    } else {
      communeControl?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Veuillez corriger les erreurs du formulaire');
      return;
    }

    if (this.form.value.password !== this.form.value.password_confirmation) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        const errors = err.error?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0] as string[];
          this.errorMessage.set(firstError[0]);
        } else {
          this.errorMessage.set(err.error?.message || 'Une erreur est survenue');
        }
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['email']) return "Format d'email invalide";
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['pattern']) return 'Format invalide (10 chiffres)';

    return 'Champ invalide';
  }
}