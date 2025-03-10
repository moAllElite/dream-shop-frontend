import {Component, Inject, inject} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-snack-bar',
   imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) { }
}
