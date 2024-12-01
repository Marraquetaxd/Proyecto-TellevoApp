import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViajePageRoutingModule } from './viaje-routing.module';
import { SharedModule } from '../shared/shared.module'; 
import { ViajePage } from './viaje.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ViajePage]
})
export class ViajePageModule {}
addEventListener