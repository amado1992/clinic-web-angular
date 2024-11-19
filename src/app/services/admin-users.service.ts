import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { Order } from '../models/order.enum';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role.model';
import { Especialidad } from '../models/especialidad.model';
import { Servicio } from '../models/servicio.model';
import { Specialist } from '../models/specialist.model';
import { Rama } from '../models/rama.model';
import { Sala } from '../models/sala.model';
import { Permiso } from '../models/permiso.model';
import { Device } from '../models/device.model';
import { Tratamiento } from '../models/tratamiento.model';
import { Asistencia } from '../models/asistencia.model';
import { CitaAux } from '../models/citaAux.model';
import { Clasificador } from '../models/clasificador.model';
import { Codificador } from '../models/codificador.model';
import { ICompany, OpcionPago } from '../models/opcionPago.model';
import { SettingRD } from '../models/settingRD';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  usersReloadRequired = new Subject<any>();

  constructor(private http: HttpClient) { }

  getRegisteredUsers(): Observable<User[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('filterAvailable', '')
      .set('rolId', '0')
      .set('specialtyId', '0')
      .set('order', 'asc')
      .set('property', 'nombreUsuario')
      .set('page', '0')
      .set('size', '-1');

    return this.getUsers(defaultParams)
      .pipe(
        map( (data: {total: number, employees: User[]}) => data.employees)
      );
  }

  getFilterEmployees(filterText: string, filterAvailable: string, rolId: number, specialtyId: number,
    filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, employees: User[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('filterAvailable', '')
      .set('rolId', rolId.toString())
      .set('specialtyId', specialtyId.toString())
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getUsers(defaultParams);
  }

  getUserByUsername(username: string): Observable<User> {
    const params = new HttpParams()
      .set('userName', username);

    return this.http.get(environment.urls.getUser, {params}).pipe(
      map(
        (user: any) => user
      )
    );
  }

  createUser(user: User): Observable<any> {
    return this.http.post(environment.urls.updateEmployee, user);
  }

  updateEmployee(user: User): Observable<any> {
    return this.http.post(environment.urls.updateEmployee, user);
  }

  private getUsers(filterParams: HttpParams): Observable<{total: number, employees: User[]}> {
    return this.http.get(environment.urls.getFilterEmployees, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          employees: data['employees'].map(item => item)
        };
      })
    );
  }

  getRegisteredRoles(): Observable<Role[]> {
    return this.http.get(environment.urls.getRoles).pipe(
      map((data: any[]) => data.map(item => item))
    );
  }

  getFilteredSpecialties(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, specialties: Especialidad[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getSpecialties(defaultParams);
  }

  getRegisteredSpecialties(): Observable<Especialidad[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getSpecialties(defaultParams)
      .pipe(
        map( (data: {total: number, specialties: Especialidad[]}) => data.specialties)
      );
  }

  private getSpecialties(filterParams: HttpParams): Observable<{total: number, specialties: Especialidad[]}> {
    return this.http.get(environment.urls.getFilterSpecialtys, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          specialties: data['specialties'].map(item => item)
        };
      })
    );
  }

  getFilterServices(filterText: string, branchId: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, services: Servicio[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('branchId', branchId)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getServices(defaultParams);
  }

  private getServices(filterParams: HttpParams): Observable<{total: number, services: Servicio[]}> {
    return this.http.get(environment.urls.getFilterServices, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          services: data['services'].map(item => item)
        };
      })
    );
  }

  getRegisteredServices(): Observable<Servicio[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('branchId', '0')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getServices(defaultParams)
      .pipe(
        map( (data: {total: number, services: Servicio[]}) => data.services)
      );
  }

  getRegisteredLocations(): Observable<any> {
    return this.http.get(environment.urls.getLocationsDevices);
  }

  getEmployee(id: string): Observable<User> {
    return this.http.get<User>(environment.urls.getEmployee + id);
  }

  addEmployeeSpecialities(esp: Specialist): Observable<any> {
    return this.http.post(environment.urls.addEmployeeSpecialities, esp);
  }

  removeEmployeeSpecialities(esp: Specialist): Observable<any> {
    return this.http.post(environment.urls.removeEmployeeSpecialities, esp);
  }

  getFilterBranchs(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, branchs: Rama[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getBranchs(defaultParams);
  }

  private getBranchs(filterParams: HttpParams): Observable<{total: number, branchs: Rama[]}> {
    return this.http.get(environment.urls.getFilterBranchs, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          branchs: data['branchs'].map(item => item)
        };
      })
    );
  }

  getRegisteredBranchs(): Observable<Rama[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getBranchs(defaultParams)
      .pipe(
        map( (data: {total: number, branchs: Rama[]}) => data.branchs)
      );
  }

  getFilterRooms(filterText: string, filterActive: string, filterAvailable: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, rooms: Sala[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('filterActive', filterActive)
      .set('filterAvailable', filterAvailable)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getRooms(defaultParams);
  }

  private getRooms(filterParams: HttpParams): Observable<{total: number, rooms: Sala[]}> {
    return this.http.get(environment.urls.getFilterRooms, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          rooms: data['rooms'].map(item => item)
        };
      })
    );
  }


  getSettingsRD(): Observable<{settingsRD: SettingRD[]}> {
    return this.http.get(environment.urls.getSettingRD).pipe(
      map((data: any[]) => {
        return {
          settingsRD: data['settings'].map(item => item)
        };
      })
    );
  }

  setSettingsRD(settingRD: SettingRD): Observable<any> {
    return this.http.post(environment.urls.setSettingRD, settingRD);
  }

  getRegisteredRooms(): Observable<Rama[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('filterActive', '')
      .set('filterAvailable', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getRooms(defaultParams)
      .pipe(
        map( (data: {total: number, rooms: Sala[]}) => data.rooms)
      );
  }

  getFilterPermissions(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, permissions: Permiso[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getPermissions(defaultParams);
  }

  private getPermissions(filterParams: HttpParams): Observable<{total: number, permissions: Permiso[]}> {
    return this.http.get(environment.urls.getFilterPermissions, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          permissions: data['permissions'].map(item => item)
        };
      })
    );
  }

  getRegisteredPermissions(): Observable<Permiso[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getPermissions(defaultParams)
      .pipe(
        map( (data: {total: number, permissions: Permiso[]}) => data.permissions)
      );
  }

  getFilterRoles(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, rols: Role[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getRoles(defaultParams);
  }

  private getRoles(filterParams: HttpParams): Observable<{total: number, rols: Role[]}> {
    return this.http.get(environment.urls.getFilterRols, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          rols: data['rols'].map(item => item)
        };
      })
    );
  }

  getFilterExternalDevices(filterText: string, locationId: number, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, devices: Device[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('locationId', locationId.toString())
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

      return this.http.get(environment.urls.getFilterExternalDevices, {params: defaultParams}).pipe(
        map((data: any[]) => {
          return {
            total: data['total'],
            devices: data['devices'].map(item => item)
          };
        })
      );
  }

  getRol(id: string): Observable<Role> {
    return this.http.get<Role>(environment.urls.getRol + id);
  }

  getRegisteredEmployees(): Observable<User[]> {
    return this.http.get(environment.urls.geRegisterEmployees).pipe(
      map( (data: {total: number, employees: User[]}) => data.employees)
    );
  }

  updateService(updateService: Servicio): Observable<any> {
    return this.http.post(environment.urls.updateService, updateService);
  }

  updateBranch(updateBranch: Rama): Observable<any> {
    return this.http.post(environment.urls.updateBranch, updateBranch);
  }

  updateRoom(updateRoom: Sala): Observable<any> {
      return this.http.post(environment.urls.updateRoom, updateRoom);
  }

  updatePermission(updatePermission: Permiso): Observable<any> {
    return this.http.post(environment.urls.updatePermission, updatePermission);
  }

  updateRol(updateRol: Role): Observable<any> {
    return this.http.post(environment.urls.updateRol, updateRol);
  }

  updateDevice(updateDevice: Device): Observable<any> {
    return this.http.post(environment.urls.updateExternalDevice, updateDevice);
  }

  updateClassificator(updateClassificator: Clasificador): Observable<any> {
    return this.http.post(environment.urls.updateClassificatorSB, updateClassificator);
  }

  updateCodCodificador(updateCodCodificador: Codificador): Observable<any> {
    return this.http.post(environment.urls.updateCodClassificatorSB, updateCodCodificador);
  }

  updateOpcionPago(updateCodOpcionPago: OpcionPago): Observable<any> {
    return this.http.post(environment.urls.updatePayOption, updateCodOpcionPago);
  }

  getReportFilterTreatments(filter: any): Observable<{total: number, treatments: Tratamiento[]}> {
    return this.http.post(environment.urls.getReportFilterTreatments, filter).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          treatments: data['treatments'].map(item => item)
        };
      })
    );
  }

  getFilterRegisterAssistance(filter: any): Observable<{total: number, assistances: Asistencia[]}> {
    return this.http.post(environment.urls.getFilterRegisterAssistance, filter).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          assistances: data['assistances'].map(item => item)
        };
      })
    );
  }

  getServicesCount(filter: any): Observable<any> {
    return this.http.post(environment.urls.getServicesCount, filter);
  }

  getRoomsCount(filter: any): Observable<any> {
    return this.http.post(environment.urls.getRoomsCount, filter);
  }

  getEmployeesCount(filter: any): Observable<any> {
    return this.http.post(environment.urls.getEmployeesCount, filter);
  }

  getTreatmentsCountByStatus(filter: any): Observable<any> {
    return this.http.post(environment.urls.getTreatmentsCountByStatus, filter);
  }

  getCitationsCount(filter: any): Observable<any> {
    return this.http.post(environment.urls.getCitationsCount, filter);
  }

  getCitationsCountByStatus(filter: any): Observable<any> {
    return this.http.post(environment.urls.getCitationsCountByStatus, filter);
  }

  getFilterEmployeesBySpecialities(specialtyId: number): Observable<{total: number, employees: User[]}> {
    const defaultParams = new HttpParams()
      .set('specialtyId', specialtyId.toString());

      return this.http.get(environment.urls.getFilterEmployeesBySpecialities, {params: defaultParams}).pipe(
        map((data: any[]) => {
          return {
            total: data['total'],
            employees: data['employees'].map(item => item)
          };
        })
      );
  }

  getPatientsCitationByDate(filter: any): Observable<any> {
    return this.http.post(environment.urls.getPatientsCitationByDate, filter);
  }

  getFilterCitations(filter: any): Observable<{total: number, citations: CitaAux[]}> {
    return this.http.post(environment.urls.getFilterCitations, filter).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          citations: data['citations'].map(item => item)
        };
      })
    );
  }

  getFilterClassificators(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, classificators: Clasificador[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getClassificators(defaultParams);
  }

  private getClassificators(filterParams: HttpParams): Observable<{total: number, classificators: Clasificador[]}> {
    return this.http.get(environment.urls.getFilterClassificatorsSB, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          classificators: data['classificatorsSB'].map(item => item)
        };
      })
    );
  }

  getRegisteredClassificators(): Observable<Clasificador[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('property', 'clasificador')
      .set('page', '0')
      .set('size', '-1');

    return this.getClassificators(defaultParams)
      .pipe(
        map( (data: {total: number, classificators: Clasificador[]}) => data.classificators)
      );
  }

  getFilterCodClassificators(filterText: string, filterProperty: string, order: Order,
    page: number, pageSize: number ): Observable<{total: number, codClassificators: Codificador[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getCodClassificators(defaultParams);
  }

  private getCodClassificators(filterParams: HttpParams): Observable<{total: number, codClassificators: Codificador[]}> {
    return this.http.get(environment.urls.getFilterCodClassificatorsSB, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          codClassificators: data['codClassificatorsSB'].map(item => item)
        };
      })
    );
  }

  getRegisteredCodClassificators(): Observable<Codificador[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getCodClassificators(defaultParams)
      .pipe(
        map( (data: {total: number, codClassificators: Codificador[]}) => data.codClassificators)
      );
  }

  getFilterPaymentOptions(filterText: string, filterInsurance: string, filterProperty: string,  order: Order,
    page: number, pageSize: number ): Observable<{total: number, paymentOptions: OpcionPago[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('filterInsurance', filterInsurance)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getPaymentOptions(defaultParams);
  }

  private getPaymentOptions(filterParams: HttpParams): Observable<{total: number, paymentOptions: OpcionPago[]}> {
    return this.http.get(environment.urls.getFilterPayOptions, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          paymentOptions: data['payoptions'].map(item => item)
        };
      })
    );
  }

  getRegisteredPaymentOptions(): Observable<OpcionPago[]> {
    const defaultParams = new HttpParams()
      .set('filterValue', '')
      .set('filterInsurance', '')
      .set('order', 'asc')
      .set('property', 'nombre')
      .set('page', '0')
      .set('size', '-1');

    return this.getPaymentOptions(defaultParams)
      .pipe(
        map( (data: {total: number, paymentOptions: OpcionPago[]}) => data.paymentOptions)
      );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteEmployee + id);
  }

  deleteRol(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteRol + id);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteService + id);
  }

  deleteBranch(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteBranch + id);
  }

  deleteRoom(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteRoom + id);
  }

  deletePermission(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deletePermission + id);
  }

  deleteExternalDevice(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteExternalDevice + id);
  }

  deleteClassificator(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteClassificatorSB + id);
  }

  deleteCodClassificator(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteCodClassificatorSB + id);
  }

  deleteOpcionPago(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deletePayOption + id);
  }

  getReports(): Observable<any> {
    return this.http.get<any>(environment.urls.getAllReport);
  }

  getExecuteReport(filter: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    var raw = JSON.stringify({"id":1,"format":1,"parameters":{"fecha_reporte":"2023-08-21"}});
    const params = new HttpParams()
    .set('', raw)

    var requestOptions = {
      headers: headers,
      params: params 
    };
    return this.http.get(environment.urls.executeReport, requestOptions);
  }

  executeReport(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.urls.executeReport, body);
    //return this.http.post(environment.urls.executeReport, body, {headers: headers});
  }

  public getPayOptions(): Observable<any> {
    return this.http.get(environment.urls.getFilterPayOptions)
  }

  //Company service
  getFilterInsuranceCompany(filterText: string, filterInsurance: string, filterProperty: string,  order: Order,
    page: number, pageSize: number ): Observable<{total: number, compannias: ICompany[]}> {
    const defaultParams = new HttpParams()
      .set('filterValue', filterText)
      .set('filterInsurance', filterInsurance)
      .set('order', order === Order.desc ? 'desc' : 'asc')
      .set('property', filterProperty)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.getCompanyOptions(defaultParams);
  }

  private getCompanyOptions(filterParams: HttpParams): Observable<{total: number, compannias: ICompany[]}> {
    return this.http.get(environment.urls.getFilterInsuranceCompany, {params: filterParams}).pipe(
      map((data: any[]) => {
        return {
          total: data['total'],
          compannias: data['compannias'].map(item => item)
        };
      })
    );
  }

  updateInsuranceCompany(updateInsuranceCompany: ICompany): Observable<any> {
    return this.http.post(environment.urls.updateInsuranceCompany, updateInsuranceCompany);
  }

  deleteInsuranceCompany(id: string): Observable<any> {
    return this.http.delete<any>(environment.urls.deleteInsuranceCompany + id);
  }
  //End service company

}
