import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeMapaPage } from './viaje-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeMapaPageRoutingModule {}
