import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from './jwt-decoder.service';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token = '';
  message = new Subject<string>();

  constructor(private http: HttpClient, private jwtDecoder: JwtDecoderService) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(environment.urls.login, {
      nombreUsuario: username,
      contrasenna: password
    }).pipe(
      tap((data: any) => {
        const userData = this.jwtDecoder.decode(data.token);
        this.setUsername(userData.sub);
        // this.setUserPermisos(userData.permisos);
        this.setToken(data.token);
      })
    );
  }

  loadImage(): Observable<any> {
    return this.http.get(environment.urls.getImageEmployee).pipe(
      tap((data: any[]) => {
        this.setUserImage(data['foto']);
      })
    );
  }

  private setToken(token: string) {
    localStorage.removeItem('usertoken');
    localStorage.setItem('usertoken', token);
    this.token = localStorage.getItem('usertoken');
  }

  private setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  private setUserImage(userImage: any): void {
    localStorage.setItem('userImage', userImage);
  }

  // private setUserPermisos(userPermisos: any[]): void {

  //   if(userPermisos != null && userPermisos.length > 0)
  //   {
  //     var savePermisos = "";
  //     userPermisos.forEach((permiso =>
  //       {
  //         savePermisos += permiso.nombre + ",";
  //       }));   
  //   }
  //   localStorage.setItem('userPermisos', savePermisos);
  // }

  isAuthenticated(): boolean {
    return localStorage.getItem('usertoken') !== undefined && localStorage.getItem('usertoken') !== null;
  }

  isHavePermission(needPermission: string): boolean {

    var exist_token = localStorage.getItem('usertoken') !== undefined && localStorage.getItem('usertoken') !== null

    if(!exist_token)
    return false;

    const userData = this.jwtDecoder.decode(localStorage.getItem('usertoken'));
    var userPermisos = userData.permisos;
    if(userPermisos !== undefined && userPermisos !== null)
    {
        var foundPermiso: boolean = false;
        if(userPermisos != null && userPermisos.length > 0)
        {
          userPermisos.forEach((permiso =>
              {
                 if (permiso.nombre === needPermission)
                 {
                     foundPermiso = true;
                 }
              })); 
        }
        return foundPermiso;
    }
    return false;
  }

  logout(): Observable<any> {
    return this.http.get(environment.urls.logout).pipe(
      tap((data: any) => {
        localStorage.removeItem('usertoken');
        // localStorage.removeItem('userPermisos');
        localStorage.removeItem('userImage');
      })
    );
  }
}
