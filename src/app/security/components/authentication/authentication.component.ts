import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {
  FormBuilder,
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
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-authentication',
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,MatIconModule, MatCardModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent    {

  public    formBuilder: FormBuilder =inject(FormBuilder);
    authService: AuthService = inject(AuthService);
  errorMessage = signal('');
    router: Router = inject(Router);
    emailCtrl:FormControl = new FormControl('',[Validators.required, Validators.email]);
    passwordCtrl:FormControl = new FormControl('',[Validators.required]);
    formGroup: FormGroup = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
    //
    constructor() {
    merge(this.emailCtrl.statusChanges, this.emailCtrl.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  /**
   * on login
   */
  onLogin() {
    this.authService.login(this.formGroup.value).subscribe(
      (response:BearerToken | ErrorMessage):void => {
          const bearer = response as BearerToken;
          this.authService.setCookieToken(bearer.token);
          this.router.navigate(['/']).then(() => {
          });
      },
      (error:ErrorMessage) => {
        alert(error.message);
      }
    )

  }

  updateErrorMessage() {
    if (this.emailCtrl.hasError('required' )) {
      this.errorMessage.set('L\'email est requis ');
    } else if (this.emailCtrl.hasError('email')) {
      this.errorMessage.set('Email invalid');
    } else {
      this.errorMessage.set('');
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

    public get password(){
      return this.formGroup.get('password');
    }
    public get email(){
    return this.formGroup.get('email');
    }
}
