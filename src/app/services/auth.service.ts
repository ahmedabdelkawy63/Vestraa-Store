import { doc, getDoc, Firestore, setDoc } from '@angular/fire/firestore';

import { inject, Injectable, signal, computed } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { User } from '@angular/fire/auth';
import { firstValueFrom, from, Observable } from 'rxjs';
import { signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  private user$ = authState(this.firebaseAuth);
  private firestore = inject(Firestore);

  currentUserSig = signal<User | null | undefined>(undefined);

  isLoggedSig = computed(
    () => this.currentUserSig() !== null && this.currentUserSig() !== undefined
  );

  isAuthLoading = computed(() => this.currentUserSig() === undefined);

  constructor() {
    this.user$.subscribe((user) => {
      this.currentUserSig.set(user);
    });
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }

  isLogged(): boolean {
    console.log(this.firebaseAuth.currentUser != null);

    return !!localStorage.getItem('uid');
  }

  async getCurrentUser(): Promise<User | null> {
    return await firstValueFrom(this.user$);
  }
  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider).then(async (result) => {
      const user = result.user;
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photo: user.photoURL || '',
        });
      }
    });
  }
}
