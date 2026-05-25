import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedList, Shipment } from '../models/shipment.model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private url = `${environment.apiUrl}/shipment`;

  constructor(private http: HttpClient) {}

  getAll(pageIndex = 1, pageSize = 10, estado?: string) {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    if (estado) params = params.set('estado', estado);
    return this.http.get<ApiResponse<PaginatedList<Shipment>>>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Shipment>>(`${this.url}/${id}`);
  }

  create(shipment: Shipment) {
    return this.http.post<ApiResponse<Shipment>>(this.url, shipment);
  }

  update(id: number, shipment: Shipment) {
    return this.http.put<ApiResponse<Shipment>>(`${this.url}/${id}`, shipment);
  }

  updateState(id: number, estado: string) {
    return this.http.patch<ApiResponse<Shipment>>(`${this.url}/${id}/estado`, { estado });
  }

  cancel(id: number) {
    return this.http.patch<ApiResponse<Shipment>>(`${this.url}/${id}/cancelar`, {});
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<Shipment>>(`${this.url}/${id}`);
  }
}