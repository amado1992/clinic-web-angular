import { User } from './user.model';

export interface Asistencia {
  id: number;   
  fechaEntrada: any;
  fechaSalida: any; 
  empleado : User;
}
