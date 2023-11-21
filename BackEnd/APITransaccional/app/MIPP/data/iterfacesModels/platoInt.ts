export interface platosInterface {
    plato_id?: number | 0;
    nombre_plato?: string | '';
    descripcion?: string | '';
    precio?: number | 0;
    imagen?: string | null;
    estado?: 'Disponible' | 'No disponible';
  }