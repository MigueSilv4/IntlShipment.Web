import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core'; // 1. Importamos Inject y PLATFORM_ID
import { isPlatformBrowser, CommonModule } from '@angular/common'; // 2. Importamos isPlatformBrowser
import { Router } from '@angular/router';
import { ShipmentService } from '../../../core/services/shipment.service';
import { Shipment } from '../../../core/models/shipment.model';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipment-list.component.html',
  styleUrl: './shipment-list.component.scss'
})
export class ShipmentListComponent implements OnInit {
  shipments: Shipment[] = [];
  pageIndex = 1;
  totalPages = 1;
  loading = false;
  error = '';

  constructor(
    private shipmentService: ShipmentService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this.load(); 
    }
  }

  load() {
    this.loading = true;
    this.error = ''; 

    this.shipmentService.getAll(this.pageIndex).subscribe({
      next: (res) => {
        console.log('Respuesta del Backend:', res);

        if (res && res.success && res.data) {
          this.shipments = [...(res.data.items || [])];
          this.totalPages = res.data.totalPages || 1;
        } else {
          this.error = 'La estructura de datos devuelta por el servidor no es correcta.';
        }

        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        this.error = 'Error al cargar los envíos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  new() { 
    this.router.navigate(['/shipments/new']); 
  }

  edit(id: number) { 
    this.router.navigate(['/shipments/edit', id]); 
  }

  cancel(id: number) {
    this.shipmentService.cancel(id).subscribe({
      next: () => this.load()
    });
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este envío?')) {
      this.shipmentService.delete(id).subscribe({
        next: () => this.load()
      });
    }
  }

  prev() { 
    if (this.pageIndex > 1) { 
      this.pageIndex--; 
      this.load(); 
    } 
  }

  next() { 
    if (this.pageIndex < this.totalPages) { 
      this.pageIndex++; 
      this.load(); 
    } 
  }
}