import { Rama } from "./rama.model";

export interface Servicio {
  descripcion: string;
  nombre: string;
  id: string;
  color: string;
  rama: Rama;
  version: string;
}
