import { Role } from './role.model';
import { Servicio } from './servicio.model';
import { Especialidad } from './especialidad.model';

export interface User {
  id: number;   
  nombres: string;
  apellidos: string; 
  nombreUsuario: string;
  contrasenna: string;
  tokenNotificacion: string;
  tokenNotificacionExterno: string;
  disponible: string;
  roles: Role[];
  foto : any;
  servicios: Servicio[];
  especialidades: Especialidad[];
}
