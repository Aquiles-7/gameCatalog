import { Router } from '@angular/router';
import { Component , inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup , FormControl , Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

constructor(
  private authService: AuthService,
  private router: Router
) {}

  form = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value as User)
      .then(() => {
        this.router.navigate(['/login']);
      })
    }
  }

}
