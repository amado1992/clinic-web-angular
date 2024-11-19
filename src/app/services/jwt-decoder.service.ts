import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {

  decode(jwt: string): any {
    if (jwt) {
      return jwt_decode(jwt);
    } else {
      return null;
    }
  }
}
