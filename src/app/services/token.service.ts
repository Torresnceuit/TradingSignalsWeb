import { Injectable } from '@angular/core';
import { Prefs } from '../models/prefs';
import { TokenGet, Token } from '../models/token';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenService {

  constructor(private http: HttpClient) { }

  /**
   * load the token straight from storage
   */
  getStorageToken(): Token {
    // check the token exists
    if (!this.hasToken())
      return null;

    let token: Token = new Token();

    // load the token values from localStorage
    token.accessToken = localStorage.getItem(Prefs.TOKEN_ACCESS_TOKEN);
    token.refreshToken = localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN);
    token.userId = localStorage.getItem(Prefs.TOKEN_USERID);

    if (localStorage.getItem(Prefs.TOKEN_ROLES) != null)
      // split roles to create an array
      token.roles = localStorage.getItem(Prefs.TOKEN_ROLES).split(',');

    if (token.roles == null)
      token.roles = [];

    // construct a new date object from the saved string
    token.expires = new Date(localStorage.getItem(Prefs.TOKEN_EXPIRES));

    return token;
  }

  tokenExpired(): boolean {
    // if now is after when the token expires
    return new Date().getTime() > this.getStorageToken().expires.getTime();
  }

  /**
   * is there a token saved
   */
  hasToken(): boolean {
    // make sure all the tokens properties exist
    return localStorage.getItem(Prefs.TOKEN_ACCESS_TOKEN) != null && localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN) != null != null && localStorage.getItem(Prefs.TOKEN_USERID) != null && localStorage.getItem(Prefs.TOKEN_EXPIRES) != null;
  }

  /**
   * delete the token from local storage
   */
  deleteToken() {
    localStorage.removeItem(Prefs.TOKEN_ACCESS_TOKEN);
    localStorage.removeItem(Prefs.TOKEN_REFRESH_TOKEN);
    localStorage.removeItem(Prefs.TOKEN_USERID);
    localStorage.removeItem(Prefs.TOKEN_ROLES);
    localStorage.removeItem(Prefs.TOKEN_EXPIRES);
  }

  /**
   * save the token into local storage
   * @param token the token from the api
   */
  saveToken(token: TokenGet) {
    localStorage.setItem(Prefs.TOKEN_ACCESS_TOKEN, token.access_token);
    localStorage.setItem(Prefs.TOKEN_REFRESH_TOKEN, token.refresh_token);
    localStorage.setItem(Prefs.TOKEN_USERID, token.userId);

    if (token.roles != '' && token.roles != null)
      localStorage.setItem(Prefs.TOKEN_ROLES, token.roles);
    else
      localStorage.removeItem(Prefs.TOKEN_ROLES);

    // create a new date
    let expiry: Date = new Date();

    // expiry is now + token lifetime * 1000 as managed in milliseconds
    expiry.setTime(expiry.getTime() + (token.expires_in * 1000))

    // save the date as a string
    localStorage.setItem(Prefs.TOKEN_EXPIRES, expiry.toString());
  }

  refreshToken(): Observable<Token>{
    // Request a new token
    let body: string = "grant_type=refresh_token&refresh_token=" + localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN);
    return Observable.create(o => {
      this.http.post<TokenGet>(environment.base_endpoint + "/api/account/token", body).subscribe(token => {
        this.saveToken(token);
        o.next(this.getStorageToken());
      }, error => {
        console.warn("Token refresh failed")
        o.error();
      })
    })

  }
}
