import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Middle } from '../../service/middle';
import { Router } from '@angular/router';

//heyo, we are on git
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private middle:Middle,private router:Router){}
  loginData = { username: '', password: '' };
  errorMsg = '';

  submitLogin() {
    this.middle.login(this.loginData).subscribe({
      next: (res) => {
        console.log("Logged in:", res);
        sessionStorage.setItem('user', JSON.stringify(res.user));
        sessionStorage.setItem('token',res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = err.error.error || "Login failed";
      }
    });
  }
}