import { Clasificador } from "./clasificador.model";

export interface Codificador {
  nombre: string;
  codigo: string;
  clasificador: Clasificador;
  id: string;
}
