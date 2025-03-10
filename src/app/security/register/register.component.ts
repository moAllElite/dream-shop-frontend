import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../core/components/snack-bar/snack-bar.component';
import {BearerToken} from '../models/bearer-token';
import {ErrorMessage} from '../../core/models/error-message';

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
        MatStepLabel,
        MatStepper,
        MatStepperNext,
        MatStepperPrevious,
        MatSuffix,
        ReactiveFormsModule
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  _formBuilder:FormBuilder  = inject(FormBuilder);
  authService:AuthService = inject(AuthService);
  formGroup:FormGroup= this._formBuilder.group({
    firstName:new FormControl('', [Validators.required,Validators.min(3)]),
    lastName:new FormControl('', [Validators.required,Validators.min(3)]),
    email:new FormControl('', [Validators.required,Validators.email]),
    password:new FormControl('', [Validators.required,Validators.required]),
    role:new FormControl('ROLE_USER'),
  });
  message:WritableSignal<string> = signal('');
  isLinear :boolean = false;

  /**
   * lock the stepper
   */
  switchLinear ():void {
    this.isLinear = !this.isLinear;
  }

  private route:Router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

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
   *  store the token in cookie
   */

  onSave():void{
    //this.formGroup.value.controls('role').setValue("ROLE_USER");
    if(!this.formGroup.valid){
      alert('Please fill all fields.');
    }
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


  goToLoginPage() {
    this.route.navigate(["/sign"]).then();
  }

  /**
   * for password hide or show text plain on input form
   */
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
