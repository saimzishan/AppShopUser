import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SignInService {

    // public apiUrl = 'http://124.109.39.22:18089/onlineappshopapi/public/api/auth/';
    public apiUrl = 'http://3877a68e.ngrok.io/api/auth/';

    constructor(public http: HttpClient) {
    }

    public registerUser(data): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'register', data);
    }

    public loginUser(data): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'login', data);
    }
}
