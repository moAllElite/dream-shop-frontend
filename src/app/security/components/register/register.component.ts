import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {BearerToken} from '../../models/bearer-token';
import {ErrorMessage} from '../../../core/models/error-message';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-register',
    imports: [
        MatButton,
        MatCard,
        MatCardContent,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatStep,
        ReactiveFormsModule,
        MatStepLabel,
        MatStepper,
        MatStepperNext,
        MatError,
        MatStepperPrevious,
        MatSuffix,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class RegisterComponent {
  _formBuilder:FormBuilder  = inject(FormBuilder);
  authService:AuthService = inject(AuthService);
  // register's form control
  firstName:FormControl=new FormControl('', [Validators.required]);
  lastName:FormControl=new FormControl('', [Validators.required]);
  email:FormControl=new FormControl('', [Validators.required,Validators.email]);
  password:FormControl=new FormControl('', [Validators.required,Validators.min(3)]);
  formGroup:FormGroup= this._formBuilder.group({
    firstName:this.firstName,
    lastName:this.lastName,
    email:this.email,
    password:this.password,
    role:new FormControl('ROLE_USER'),
  });
  message:WritableSignal<string> = signal('');
  errorLastNameMessage:WritableSignal<string> = signal('');
  errorFirstNameMessage:WritableSignal<string> = signal('');
  errorEmailMessage: WritableSignal<string> = signal('');
  errorPasswordMessage: WritableSignal<string> = signal('');

  private route:Router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  /**
   * avoid the memory leaks
   */
  constructor() {
    merge(this.lastName.statusChanges, this.lastName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(()=> this.updateErrorLastNameMessage()) ;
    merge(this.firstName.statusChanges, this.firstName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(()=> this.updateErrorFirstNameMessage()) ;

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(()=> this.updateErrorEmailMessage()) ;
    merge(this.password.statusChanges, this.password.valueChanges)
    .pipe(takeUntilDestroyed())
      .subscribe(()=> this.updateErrorPasswordMessage()) ;
  }


  /**
   * on snack bar open
   */
  openSnackBar( ) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: this.message(),
    });
    this.route.navigate(["/"]).then();
  }



  /**
   *  We register the user and
   *  store the token in cookies
   */

  onSave():void{
    //register user
    this.authService.register(this.formGroup.value).subscribe(
      {
        next: (response: BearerToken | ErrorMessage):void=> {

          const bearer: BearerToken = response as BearerToken;
          this.authService.setCookieToken(bearer.token); //store the token in cookie
          this.message.set("Inscription effectuée avec succès!!!")
          this.openSnackBar();
        },
        error: (error:BearerToken | ErrorMessage) => {
          let errorResponse: ErrorMessage= error as ErrorMessage;
          console.log();
          if(errorResponse.httpStatus ){
            this.message.set(errorResponse.message);
            this.openSnackBar();
          }
        }
      });

  }


  goToLoginPage() {this.route.navigate(["/sign"]).then();}

  /**
   * for password hide or show text plain on input form
   */
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }



  /**
   * display error message when the lastname's field is empty
   */
  updateErrorLastNameMessage() {
    if (this.lastName.hasError('required')) {
      this.errorLastNameMessage.set('Le nom est requis');
    }  else {
      this.errorLastNameMessage.set('');
    }
  }
  /**
   * display error message when the firstname's field is empty
   */
  updateErrorFirstNameMessage() {
    if (this.firstName.hasError('required')) {
      this.errorFirstNameMessage.set('Le prénom est requis');
    }else {
      this.errorFirstNameMessage.set('');
    }
  }

  /**
   * display error message when the email's field is empty
   */
  updateErrorEmailMessage() {
    if(this.email.hasError('required')) {
      this.errorEmailMessage.set('L\'email est requis');
    }else if(this.email.hasError('email')) {
      this.errorEmailMessage.set('Le format de l\'email est invalide');
    }else {
      this.errorEmailMessage.set('');
    }
  }

  /**
   * display error message when the password's field is empty
   */
  updateErrorPasswordMessage() {
    if(this.password.hasError('required')) {
      this.errorPasswordMessage.set('Le mot de passe est requis');
    }else if(this.password.hasError('min')) {
      this.errorPasswordMessage.set('Le mot de passe doit avoir au moins 3 caractères');
    }else {
      this.errorPasswordMessage.set(' ');
    }
  }
}
