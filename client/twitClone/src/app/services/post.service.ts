import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  URL = 'http://localhost:3001/'
  constructor(private http:HttpClient) { }

  addPost(post:any){
    return this.http.post(this.URL+'api/posts',post)
  }
  getPosts(data:any){
    return this.http.get(this.URL+'api/posts',{params:data})
  }
  likePost(postId:any){
    return this.http.put(this.URL+'api/posts/'+postId+'/like',{})
  }
  retweetPost(postId:any){
    return this.http.post(this.URL+'api/posts/'+postId+'/retweet',{})
  }
  getPostById(postId:any){
    return this.http.get(this.URL + 'api/posts/'+postId)
  }
  deletePost(postId:any){
    return this.http.delete(this.URL + 'api/posts/'+postId)
  }
  followUser(userId:any){
    return this.http.put(this.URL+'api/users/'+userId+'/follow',{})
  }

}
