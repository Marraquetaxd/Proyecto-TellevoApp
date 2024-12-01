import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { FooterComponent } from './footer/footer.component'; 

@NgModule({
  declarations: [FooterComponent], 
  imports: [
    CommonModule,
    RouterModule,
    IonicModule 
  ],
  exports: [FooterComponent] 
})
export class SharedModule {}
