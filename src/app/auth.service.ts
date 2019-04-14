import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { AppUser } from './models/app-user';
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/of";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router) {
    this.user$ = afAuth.authState;
  }

  async login() {
    const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") || "/";
    await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.router.navigate([returnUrl]);
    await this.user$.subscribe(user => {
      this.userService.save(user);
    });
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(["/"]);
  }

  get appUser$(): Observable<AppUser> {
    return this.user$
      .switchMap(user => {
        if (user) {
          return this.userService.get(user.uid).valueChanges();
        }
        return Observable.of(null);
      });
  }
}
