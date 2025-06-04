import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  auth = inject(Auth);
  router = inject(Router);
  fb = inject(FormBuilder);
  myAuth = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error = '';

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // userCredential.user موجود بعد تسجيل الدخول
        const user = userCredential.user;
        localStorage.setItem('uid', userCredential.user.uid);

        if (user.email === 'owner@admin.com') {
          this.router.navigate(['/dashboard/statistics']);
        } else {
          this.router.navigate(['/home']);
        }
      })
      .catch((err) => {
        this.error = 'invalid Email or Password';
      });
  }
  googleLogin(): void {
    this.myAuth
      .googleLogin()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log('error');
      });
  }
}
