import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router,private userAuth:UserAuthService) { }

  ngOnInit(): void {
  }
  logout(){
    this.userAuth.setUser(null)
    this.router.navigate([''])
  }

}
