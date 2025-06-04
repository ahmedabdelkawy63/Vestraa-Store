import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  firestore = inject(Firestore);
  uid = localStorage.getItem('uid');

  userData: any = null; // هذا المتغير سيحمل بيانات اليوزر

  constructor() {
    if (this.uid) {
      const userRef = doc(this.firestore, `users/${this.uid}`);
      getDoc(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.userData = snapshot.data(); // خزّن بيانات اليوزر
          console.log('User Data:', this.userData);
        } else {
          console.log('No such user!');
        }
      });
    } else {
      console.log('No UID found in localStorage');
    }
  }
}
