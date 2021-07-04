import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { UserAuthService } from 'src/app/services/user-auth.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm = new FormGroup({
    firstName:new FormControl(),
    lastName:new FormControl(),
    email:new FormControl(),
    username:new FormControl(),
    password:new FormControl(),
    confirmPassword:new FormControl(),
  },
  {
    validators:(control)=>{
      // if(control.value.password !== control.value.confirmPassword){
      //   control.get('confirmPassword')?.setErrors({'notSame':true})
      // }
      // return null
      const pwd = control.value.password;
      const cpwd = control.value.confirmPassword;
      let validate = false;
      // if((this.signUpForm.controls.password.touched && this.signUpForm.controls.password.dirty) && 
      //    (this.signUpForm.controls.confirmPassword.touched && this.signUpForm.controls.confirmPassword.dirty)){
      //      validate = true
      //    }
      return pwd !== cpwd ? {'perror':true} : null
    }
  }
  )
  constructor(private userAuth:UserAuthService,private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.signUpForm.value)
    this.userAuth.registerUser(this.signUpForm.value).subscribe(
      (data)=>{
        this.userAuth.setUser(data)
        this.router.navigate(['home/posts'])
      },(err)=>{
        console.log(err)
      }
    )

  }

}
