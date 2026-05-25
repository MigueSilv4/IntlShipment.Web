import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentService } from '../../../core/services/shipment.service';
import { Shipment } from '../../../core/models/shipment.model';

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipment-form.component.html',
  styleUrl: './shipment-form.component.scss'
})
export class ShipmentFormComponent implements OnInit {
  isEdit = false;
  id?: number;
  error = '';
  loading = false;

  shipment: Shipment = {
    numeroGuia: '',
    paisOrigen: '',
    paisDestino: '',
    ciudadOrigen: '',
    ciudadDestino: '',
    nombreRemitente: '',
    nombreDestinatario: '',
    descripcionMercancia: '',
    pesoKg: 0,
    estado: 'Creado',
    fechaEstimadaEntrega: ''
  };

  estados = ['Creado', 'En tránsito', 'Entregado', 'Cancelado'];

  constructor(
    private shipmentService: ShipmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.shipmentService.getById(this.id).subscribe({
        next: (res) => { 
          if (res.success) {
            this.shipment = res.data; 
          }
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los datos del envío.';
        }
      });
    }
  }

  save() {
    this.error = '';

    if (!this.shipment.numeroGuia || this.shipment.numeroGuia.trim() === '') {
      this.error = 'El número de guía es obligatorio.';
      return;
    }

    if (this.shipment.paisOrigen && this.shipment.paisDestino && 
        this.shipment.paisOrigen.trim().toLowerCase() === this.shipment.paisDestino.trim().toLowerCase()) {
      this.error = 'El país de origen no puede ser igual al país de destino.';
      return;
    }

    if (Number(this.shipment.pesoKg) <= 0) {
      this.error = 'El peso del envío debe ser mayor que cero.';
      return;
    }

    if (this.shipment.fechaEstimadaEntrega) {
      const fechaEstimada = new Date(this.shipment.fechaEstimadaEntrega + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaEstimada < hoy) {
        this.error = 'La fecha estimada de entrega no puede ser menor que la fecha actual.';
        return;
      }
    }

    if (this.isEdit && (this.shipment.estado === 'Entregado' || this.shipment.estado === 'Cancelado')) {
      this.error = 'No se pueden modificar envíos en estado Entregado o Cancelado.';
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.shipmentService.update(this.id!, this.shipment).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/shipments']);
          } else {
            this.error = res.message || 'Error al actualizar el envío.';
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Error de red al actualizar el envío.';
          this.loading = false;
        }
      });

    } else {

      const { id, ...shipmentParaCrear } = this.shipment;

      if (shipmentParaCrear.fechaEstimadaEntrega) {
        shipmentParaCrear.fechaEstimadaEntrega = shipmentParaCrear.fechaEstimadaEntrega.split('T')[0];
      } else {
        shipmentParaCrear.fechaEstimadaEntrega = new Date().toISOString().split('T')[0];
      }

      shipmentParaCrear.pesoKg = Number(shipmentParaCrear.pesoKg) || 0;

      this.shipmentService.create(shipmentParaCrear).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/shipments']);
          } else {
            this.error = res.message || 'El número de guía ya existe o los datos son inválidos.';
            this.loading = false;
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || err.error?.Message || 'Error de validación en el servidor (400).';
        }
      });
    }
  }

  cancel() { 
    this.router.navigate(['/shipments']); 
  }
}