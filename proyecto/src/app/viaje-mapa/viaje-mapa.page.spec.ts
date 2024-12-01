import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeMapaPage } from './viaje-mapa.page';

describe('ViajeMapaPage', () => {
  let component: ViajeMapaPage;
  let fixture: ComponentFixture<ViajeMapaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
