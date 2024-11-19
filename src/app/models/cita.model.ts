import { Rama } from "./rama.model";
import { User } from "./user.model";
import { Paciente } from "./paciente.model";
import { Tratamiento } from "./tratamiento.model";


export interface Cita {
  id: number;
  fechaCreacion: any;
  fechaTerminacion: any;
  estado: string;
  localizacionPaciente: string;
  ramas: Rama[];
  empleados: User[];
  paciente: Paciente;
  tratamientos: Tratamiento[];
  ramasTerminadas: number[];
}
