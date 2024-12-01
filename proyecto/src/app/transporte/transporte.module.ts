import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransportePageRoutingModule } from './transporte-routing.module';
import { SharedModule } from '../shared/shared.module'; 
import { TransportePage } from './transporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportePageRoutingModule,
    SharedModule
  ],
  declarations: [TransportePage]
})
export class TransportePageModule {}
