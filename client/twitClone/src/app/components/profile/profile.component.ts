import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile:any;
  posts:any;
  isReply = false;
  username:any;
  followers:any;
  following:any;

  constructor(private userAuth:UserAuthService,private route:ActivatedRoute,private postServ:PostService) { }

  ngOnInit(): void {
    // if(this.route.params){

    // }
    // this.getProfile()

    this.route.params.subscribe(
      (param)=>{
        this.username = param.username
        this.getProfile(param.username)

      },(err)=>{
        console.log(err)
      }
    )

  }
  setIsReply(isreply:any){
    this.isReply = isreply
    
    this.getProfile(this.username)
  }

  getProfile(username:string){
    this.userAuth.getProfile(username).subscribe(
      (profile)=>{      
        this.profile = profile;
        // console.log(profile,'--------------')
        this.followers = this.profile.profileUser.followers.length;
        this.following = this.profile.profileUser.following.length
        this.postServ.getPosts({postBy:this.profile.profileUser._id,isReply:this.isReply}).subscribe(
          (data)=>{
            this.posts = data
          }
        )
        
      }
    )
  }
  getFlwBtnTxt(){
    
  }

  isLiked(post:any){
    // console.log('---------',post)
    let islkd = post.likes?.includes(post.postBy._id)
    return islkd
  }

  isRetweeted(post:any){
    let isRtd =  post.retweetUsers.length &&  post.retweetUsers.includes(post.postBy._id)
    return isRtd;
  }

  retweet(post:any){
    this.postServ.retweetPost(post._id).subscribe(
      (data)=>{
        // this.getPosts()
           
      },
      (err)=>{}
    )
  }

  like(post:any){
    
    this.postServ.likePost(post._id).subscribe(
      (data)=>{
        // this.getPosts()          
      },
      (err)=>{}
    )
  
}
getRetweetText(post:any){
  if(post.retweetData !== undefined) return post.postBy.username
  return ''
}

getReplyText(post:any){
  // console.log(post,'--------------in reply')
  if(post.replyTo !== undefined) return post.replyTo.postBy.username
  return ''
}
getContent(post:any){
    
  var isRetweet = post.retweetData !== undefined
  // var retweetedBy = isRetweet ? post.postBy.username : null
  var content = isRetweet ? post.retweetData.content: post.content;

  return content

}

timeDiff(createdAt:Date){
  var current = new Date()
  var previous = new Date(createdAt)
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = +current - +previous;

  if (elapsed < msPerMinute) {
      if(Math.round(elapsed/1000) < 30) return 'Just now'
       return Math.round(elapsed/1000) + ' seconds ago';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }

  else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
  }

  else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
  }

  else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}
follow(userId:any)  {
  this.postServ.followUser(userId).subscribe(
    (data)=>{
      this.getProfile(this.username)
    }
  )
}
getFollowStatus(profile:any){
  if(profile.profileUser.followers.includes(profile.userLoggedIn._id)) return 'Following'
  return 'Follow'
}

}
