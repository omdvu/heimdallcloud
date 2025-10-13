import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Middle } from '../../service/middle';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  public constructor(private middle:Middle,private router: Router) {}

  loggeduser:String = '';
  ngOnInit(){
    let user = sessionStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.loggeduser = parsed.username;
    } else {
      window.alert("Log in not detected, please login again");
      this.logout();
    }
  }

  logout(){
    this.middle.logout();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
