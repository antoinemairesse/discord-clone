import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  error: boolean = false;
  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  signIn(){
    if(this.loginForm.valid){
      this.authService.signIn(this.email?.value, this.password?.value).then((res) => {
        this.error = !res;
      })
    }
  }

  googleAuth($event: MouseEvent) {
    $event.preventDefault()
    this.authService.googleAuth();
  }

}
