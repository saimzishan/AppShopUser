import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SignInService {

    public apiUrl = 'http://124.109.39.22:18089/onlineappshopapi/public/api/auth/';
    /*public apiUrl = 'http://18.217.12.17/api/public/api/auth/';*/
    // public apiUrl = 'http://www.econowholesale.com/api/public/api/auth/';
    // public apiUrl = 'http://8026a0a1.ngrok.io/api/auth/';

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };

    constructor(public http: HttpClient) {
    }

    public registerUser(data): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'register', data, this.httpOptions);
    }

    public loginUser(data): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'login', data);
    }

    public getErrorMessage (err) {
        let message;
        if (err.status === 401) {
            message = 'Please enter a valid email/password';
        }
        return message;
    }
}
