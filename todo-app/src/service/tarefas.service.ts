import { Injectable, EventEmitter } from '@angular/core'; 
import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpPersonService } from './http-person.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  obsListPosts: EventEmitter<any[]> = new EventEmitter<any[]>();
  obsLoadPost: EventEmitter<any> = new EventEmitter<any>();
  obsSavePost: EventEmitter<any> = new EventEmitter<any>();
  obsDeletePost: EventEmitter<any> = new EventEmitter<any>();
  public postsList: any[] = [];
  private formPost!: any;

  constructor(private http: HttpPersonService) {}

  loadPosts(): Observable<any> {
    return this.http.get('/api/tarefas');
  }

  loadPost(id: number): Observable<any> {
    return this.http.get(`/api/tarefas/${id}`);
  }

  createPost(formPost: any): Observable<any> {
    return this.http.post('/api/tarefas', formPost);
  }

  updatePost(formPost: any): Observable<any> {
    return this.http.put(`/api/tarefas/${formPost.id}`, formPost);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`/api/tarefas/${id}`);
  }

  trocaPosicao(formPost: any): Observable<any> {
  
    return this.http.put(`/api/tarefas/trocar-posicao`, formPost);
  }

  public setformPost(formPost: any) {
    this.formPost = formPost;
  }
}
