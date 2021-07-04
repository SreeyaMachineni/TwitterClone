import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { UserAuthService } from 'src/app/services/user-auth.service';
import {Router} from  '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username:new FormControl(''),
    password:new FormControl('')
  })

  constructor(private userAuth:UserAuthService,private router:Router) { }

  ngOnInit(): void {
    this.isUserLoggedIn()
  }

  isUserLoggedIn(){
    this.userAuth.getIsUserLoggedIn().subscribe((data)=>{
      console.log(data,'--------')
    })
  }
  onSubmit(){
    // console.log(this.loginForm.value)
    this.userAuth.loginUser(this.loginForm.value).subscribe(
      (data)=>{
        // alert('user loggedin')
        console.log(data)
        this.userAuth.setUser(data)
        this.router.navigate(['home/posts'])
      },(err)=>{
        
        alert(err.error.errMsg)
        console.log(err)
        
      }
    )
  }

}
