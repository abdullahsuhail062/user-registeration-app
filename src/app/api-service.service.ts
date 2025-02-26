import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { apiEnvironment, apiKeyEnvironment, environment } from './environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';




@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = environment.apiUrl
  private aiApiKey = apiKeyEnvironment.apiKey
  private aiApiUrl = apiEnvironment.apiUrl

  constructor(private http: HttpClient, private authService: AuthService) {}
    

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/registerUser`,formData,{responseType: 'json'})
}
  loginUser(formData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/api/loginUser`, formData,{responseType: 'json'})
  }

  fetchUserProfile(): Observable<any>{
    const token = this.authService.getToken()
    return this.http.get(`${this.apiUrl}/api/fetchUserProfile`,{responseType: 'json',headers: { 'Authorization': `Bearer ${token}`}}
    )
  }
  deleteAccount(): Observable<any> {
    const token = this.authService.getToken()
    return this.http.delete(`${this.apiUrl}/api/deleteAccount`,{headers: { 'Authorization': `Bearer ${token}`}});
  }

  addTask(title:any,description: any,token: any): Observable<any> {
    console.log('title',title,'description', description)
    
    return this.http.post(`${this.apiUrl}/api/tasks`,  {title,description},{headers: { 'Authorization': `Bearer ${token}`}});
}
    
saveTask(title:any,description: any,taskId:any): Observable<any>{
  return this.http.put(`${this.apiUrl}/api/updateTask`, { description,title,taskId});

}
deleteTask(taskId: any): Observable<any> {
  return this.http.delete(`${this.apiUrl}/api/deleteTask`,{params:{id:taskId}} 
  );
}

taskCompeletion(completed:boolean,taskId:string | null): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/taskCompeletion`,{completed,taskId})
}

getTasks(token:any): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/fetchTasks`,{headers:{'authorization': `Bearer ${token}` }})
}

getCompletion(body: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/ask`,{body})
}

  
}



 


  

