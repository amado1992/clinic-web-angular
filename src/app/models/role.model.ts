import { Permiso } from "./permiso.model";

export interface Role {
  descripcion: string;
  nombre: string;
  id: string;
  permisos: Permiso[];
}
