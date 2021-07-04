import {  NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { MessagesComponent } from "./components/messages/messages.component";
import { PostDetailsComponent } from "./components/post-details/post-details.component";
import { PostsComponent } from "./components/posts/posts.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SignupComponent } from "./components/signup/signup.component";

const routes:Routes = [
    {path:'',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {
        path:'home',
        component:HomeComponent,
        children:[
            {path:'messages',component:MessagesComponent},
            {path:'posts',component:PostsComponent},
            {path:'post/:id',component:PostDetailsComponent},
            {path:'profile/:username',component:ProfileComponent},
            {path:'profile',component:ProfileComponent},

        ]
    },
    
    
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{
}
