import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import {ShipmentListComponent } from './features/shipments/shipment-list/shipment-list.component';
import { ShipmentFormComponent } from './features/shipments/shipment-form/shipment-form.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shipments', component: ShipmentListComponent, canActivate: [authGuard] },
  { path: 'shipments/new', component: ShipmentFormComponent, canActivate: [authGuard] },
  { path: 'shipments/edit/:id', component: ShipmentFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];