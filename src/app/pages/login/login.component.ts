import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent{

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
        this.authService.logIn(this.form.value as User)
        .then(() => {
          this.router.navigate(['/profile']);
        }).catch((error: any) => console.log(error))
      }
  };

  onClickGoogle(){
    this.authService.loginGoogle()
    .then(() => {
        this.router.navigate(['/profile']);
    })
  };

}
