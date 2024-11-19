import { Servicio } from './servicio.model';
import { User } from './user.model';
import { Sala } from './sala.model';

export interface Tratamiento {
  id: number;
  fechaCreacion: any;
  fechaTerminacion: any;
  tiempoEstimado: any;
  tiempoReal: any;
  empleado: User;
  servicio: Servicio;
  sala: Sala;
}
