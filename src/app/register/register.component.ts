import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponse, AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })
  error: AuthResponse = {isSuccess: true, message: ''}
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register(){
    if(this.registerForm.valid){
      this.authService.signUp(this.email?.value, this.password?.value, this.username?.value).then((res) => {
        this.error = res;
      })
    }
  }

}
