import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from "@angular/common/http";
import { JwtHelperService} from '@auth0/angular-jwt'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { CustomHttpResponse } from '../models/custom-http-reponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public host = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  updateUser(formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.host}/user/update`, formData);
  }

  resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetpassword/${email}`);
  }

  updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }


  addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] {
    if(localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;

  }


  createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData {

    const formData = new FormData();
    formData.append('currentUser',loggedInUsername );
    formData.append('firstName',user.firstName);
    formData.append('lastName',user.lastName );
    formData.append('username',user.username );
    formData.append('email',user.email );
    formData.append('role',user.role );
    formData.append('profileImage',profileImage );
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNotLocked',JSON.stringify(user.notLocked));
    return formData;






  }






}
