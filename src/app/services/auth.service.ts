import { doc, getDoc, Firestore, setDoc } from '@angular/fire/firestore';
// import { inject, Injectable, signal, computed } from '@angular/core';
// import { Auth, authState } from '@angular/fire/auth';
// import { User } from '@angular/fire/auth';
// import { firstValueFrom, from, Observable } from 'rxjs';
// import { signOut } from 'firebase/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private firebaseAuth = inject(Auth);
//   private user$ = authState(this.firebaseAuth);

//   // ✅ استخدم signal لحفظ المستخدم الحالي
//   currentUserSig = signal<User | null>(null);

//   // ✅ Signal لحالة تسجيل الدخول
//   isLoggedSig = computed(() => this.currentUserSig() !== null);

//   constructor() {
//     // ✅ حدث الـ Signal مع تغيّر حالة المستخدم
//     this.user$.subscribe((user) => {
//       this.currentUserSig.set(user);
//     });
//   }

//   logout(): Observable<void> {
//     return from(signOut(this.firebaseAuth));
//   }

//   // ✅ الطريقة القديمة still useful أحيانًا
//   isLogged(): boolean {
//     return this.firebaseAuth.currentUser != null;
//   }

//   // ✅ لو حابب تستخدمها في async
//   async getCurrentUser(): Promise<User | null> {
//     return await firstValueFrom(this.user$);
//   }
// }

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

  // ✅ حالة المستخدم
  currentUserSig = signal<User | null | undefined>(undefined);

  // ✅ هل المستخدم مسجل دخول؟
  isLoggedSig = computed(
    () => this.currentUserSig() !== null && this.currentUserSig() !== undefined
  );

  // ✅ هل جاري التحميل؟
  isAuthLoading = computed(() => this.currentUserSig() === undefined);

  constructor() {
    // ✅ نحدث signal لما نعرف حالة المستخدم
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

      // لو المستخدم جديد، ضيفه في Firestore
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
