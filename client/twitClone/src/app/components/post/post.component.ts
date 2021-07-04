import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import {Router} from '@angular/router'
import { PostDetailsComponent } from '../post-details/post-details.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post:any
  replyPost:any;
  posts:any = [];
  timeStamp = 'to do later';
  postForComment:any;
  deletePost:any

  constructor(private postService:PostService,private router:Router) { }

  ngOnInit(): void {
    // console.log(this.post)
    this.getPosts()
  }

  getPosts(){
    this.postService.getPosts({}).subscribe(
      (data)=>{
        // console.log(data)

        this.posts  = data
        console.log(this.posts)
      }
    )
  }

  getContent(post:any){
    
    var isRetweet = post.retweetData !== undefined
    // var retweetedBy = isRetweet ? post.postBy.username : null
    var content = isRetweet ? post.retweetData.content: post.content;

    return content

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

  postData(){
    // console.log(this.post)
    this.postService.addPost({'post':this.post}).subscribe(
      (data)=>{
        this.post = ''
        this.getPosts()
      }
    )
  }

  postDetails(post:any){
    console.log('-------go to post----------')
    this.router.navigate(['home/post',post._id])
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

  like(post:any){
    
      this.postService.likePost(post._id).subscribe(
        (data)=>{
          this.getPosts()          
        },
        (err)=>{}
      )
    
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
    this.postService.retweetPost(post._id).subscribe(
      (data)=>{
        this.getPosts()
           
      },
      (err)=>{}
    )
  }
  setPostForComment(post:any){
    // console.log('postssssssss',post)
    this.postService.getPostById(post._id).subscribe(
      (postData)=>{
        console.log(postData,'*************reced data')
        this.postForComment = postData;
        this.postForComment = this.postForComment.postData[0]
        console.log(this.postForComment,'------psot')

      },
      (err)=>{
        console.log(err)
      }
    )
   
  }

  replyForPost(post:any){
    this.postService.addPost({'replyTo':post._id,'post':this.replyPost}).subscribe(
      (data)=>{
        this.getPosts()
        // console.log(data)
      }
    )

  }
  clsMdl(){
    this.replyPost = ''
  }

  setPostForDelete(post:any){
    this.deletePost = post
    console.log(this.deletePost,'------------del post-----------')
  }
  delPost(post:any){
    this.postService.deletePost(post._id).subscribe(
      (data)=>{
        console.log('data deltd');
        this.getPosts()
      }
    )
  }
  

}

