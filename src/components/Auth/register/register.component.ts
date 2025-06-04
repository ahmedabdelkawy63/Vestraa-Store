import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  auth = inject(Auth);
  router = inject(Router);
  fb = inject(FormBuilder);
  firestore = inject(Firestore);

  error = '';

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(01){1}(0|1|2|5){1}([0-9]{8})$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.strongPasswordValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get phone() {
    return this.registerForm.get('phone')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }
  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[\W_]/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    return !valid ? { weak: true } : null;
  }
  // Custom validator to check if password and confirmPassword match
  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error = 'Please fix the errors in the form.';
      return;
    }

    const { name, email, phone, password } = this.registerForm.value as {
      name: string;
      email: string;
      phone: string;
      password: string;
    };

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          await updateProfile(user, { displayName: name });

          // 🟢 حفظ بيانات المستخدم في Firestore
          await setDoc(doc(this.firestore, 'users', user.uid), {
            name,
            email,
            phone,
          });
        }

        await sendEmailVerification(user);

        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.error('Registration error:', err);

        // هنا نعرض رسالة الخطأ مع كود الخطأ
        switch (err.code) {
          case 'auth/email-already-in-use':
            this.error = 'This email is already in use.';
            break;
          case 'auth/invalid-email':
            this.error = 'The email address is invalid.';
            break;
          case 'auth/weak-password':
            this.error = 'The password is too weak.';
            break;
          default:
            this.error = `Registration failed: ${
              err.message || 'Unknown error.'
            }`;
        }
      });
  }
}
