import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../services/auth.service';
import {ErrorMessage} from '../../../core/models/error-message';
import {BearerToken} from '../../models/bearer-token';
import { Router } from '@angular/router';
import {  MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {finalize, merge} from 'rxjs';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {MatRipple} from '@angular/material/core';
import {User} from '../../../user/models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-authentication',
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatIconModule, MatCardModule,  MatRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent   implements OnInit{
  authService: AuthService = inject(AuthService);
  errorEmailMessage:WritableSignal<string>  = signal('');
  errorPasswordMessage:WritableSignal<string> = signal('');
  router: Router = inject(Router);
  emailCtrl:FormControl = new FormControl('',[Validators.required, Validators.email]);
  passwordCtrl:FormControl = new FormControl('',[Validators.required]);
  public formGroup!: FormGroup;
  //
  constructor() {
    merge(this.emailCtrl.statusChanges, this.emailCtrl.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorEmailMessage());

    merge(this.passwordCtrl.statusChanges, this.passwordCtrl.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPasswordMessage());
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }
  currentUser!:User;
  // Ajoutez dans votre composant
  isLoading = false;

  updateErrorEmailMessage() {
    if (this.emailCtrl.hasError('required' )) {
      this.errorEmailMessage.set('L\'email est requis ');
    } else if (this.emailCtrl.hasError('email')) {
      this.errorEmailMessage.set('Le format de l\' email est invalide');
    } else {
      this.errorEmailMessage.set('');
    }
  }

  /**
   * on click show or hide the password
   */
  hide:WritableSignal<boolean> = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  updateErrorPasswordMessage() {
    if (this.passwordCtrl.hasError('required')) {
      this.errorPasswordMessage.set('Le mot de passe est requis ');
    }else {
      this.errorPasswordMessage.set('');
    }
  }

  private _snackBar:MatSnackBar = inject(MatSnackBar);

  durationInSeconds :number= 5;

  /**
   * open snackbar with flash message
   * @param message
   */
  openSnackBar(message:string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data:message
    });
  }

  onLogin() {
    // Validation du formulaire
    if (this.formGroup.invalid) {
      alert('Please fill in all required fields correctly');
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.currentUser = this.formGroup.value;

    this.authService.login(this.currentUser)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response:BearerToken |ErrorMessage) => {
          // Vérifie si la réponse contient une erreur métier
          if ((response as BearerToken).token) {
            // Gestion du succès
            this.authService.setCookieToken((response as BearerToken).token);
            this.router.navigate(['/']).then();
          }
        },
        error: (err: HttpErrorResponse) => {
          // Affiche le message d'erreur HTTP ou le message par défaut
          const message = err.error?.message || 'Erreur de connexion';
          // afficher le snack bar d'erreur sur snack bar
          this.openSnackBar(message);
          this.resetForm();
        }
      });
  }


  private handleSuccess(tokenData: BearerToken): void {
    if (!tokenData?.token) {
      alert('Invalid server response');
      return;
    }
    this.authService.setCookieToken(tokenData.token);
    this.formGroup.reset();
    this.router.navigate(['/']).then();
  }




  /**
   * clear all fields form and hide error messages
   */
  resetForm(): void {
    this.formGroup.reset();
    this.errorPasswordMessage.set('');
    this.errorEmailMessage.set('');
  }

}
