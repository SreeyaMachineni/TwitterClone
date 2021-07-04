import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  URL = 'http://localhost:3001/'
  user:any;

  constructor(private http:HttpClient) { }

  getIsUserLoggedIn(){
    return this.http.get(this.URL+'login')
  }

  registerUser(user:any){
    console.log(user)
    return this.http.post(this.URL+'register',user)
  }
  setUser(user:any){
    this.user = user
  }

  loginUser(user:any){
    return this.http.post(this.URL +'login',user )
  }

  getUser(){
    return this.user
  }

  getProfile(username:any){
    if(username){
      return this.http.get(this.URL + 'profile/'+username)
    }
    return this.http.get(this.URL + 'profile')
  }

  


}
