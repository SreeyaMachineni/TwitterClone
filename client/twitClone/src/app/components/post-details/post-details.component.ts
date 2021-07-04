import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'

import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  constructor(private router:ActivatedRoute,private postService:PostService) { }
  postDetails:any
  showReplies:any
  replies:any;
  paramId:any
  postForComment:any;
  replyPost:any;

  ngOnInit(): void {
    this.router.params.subscribe(
      (params)=>{
        console.log(params.id)
        this.paramId = params.id
        this.getPostDetails(this.paramId)
      }
    )
  }

  getPostDetails(post_id:any){
    this.postService.getPostById(post_id).subscribe(
      (post)=>{
        console.log(post)
        this.postDetails = post;
        

        if(this.postDetails.replies){
          this.showReplies = true;
          this.replies = this.postDetails.replies
        }
        this.postDetails = this.postDetails.postData[0]
      }

    )
  }

  like(post:any){
    
    this.postService.likePost(post._id).subscribe(
      (data)=>{
        this.getPostDetails(this.paramId)          
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

  getReplyText(replies:any){
    if(replies.replyTo !== undefined) return replies.replyTo.postBy.username
    return ''
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

  getContent(post:any){
    
    var isRetweet = post.retweetData !== undefined
    // var retweetedBy = isRetweet ? post.postBy.username : null
    var content = isRetweet ? post.retweetData.content: post.content;

    return content

  }

  setPostForComment(post:any){
    // console.log('postssssssss',post)
    this.postService.getPostById(post._id).subscribe(
      (postData)=>{
        // console.log(postData,'*************reced data')
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
    this.postService.addPost({'replyTo':this.paramId,'post':this.replyPost}).subscribe(
      (data)=>{
        this.getPostDetails(this.paramId)
        // console.log(data)
      }
    )

  }

  clsMdl(){
    this.replyPost = ''
  }

}


