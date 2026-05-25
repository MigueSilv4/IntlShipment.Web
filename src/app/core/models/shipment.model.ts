export interface Shipment {
  id?: number;
  numeroGuia: string;
  paisOrigen: string;
  paisDestino: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  nombreRemitente: string;
  nombreDestinatario: string;
  descripcionMercancia: string;
  pesoKg: number;
  estado: string;
  fechaEstimadaEntrega: string;
}

export interface PaginatedList<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}