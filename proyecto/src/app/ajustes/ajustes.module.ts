import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjustesPageRoutingModule } from './ajustes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AjustesPage } from './ajustes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesPageRoutingModule,
    SharedModule
  ],
  declarations: [AjustesPage]
})
export class AjustesPageModule {}
