import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorEspecialidadesComponent } from './gestor-especialidades.component';

describe('GestorEspecialidadesComponent', () => {
  let component: GestorEspecialidadesComponent;
  let fixture: ComponentFixture<GestorEspecialidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestorEspecialidadesComponent]
    });
    fixture = TestBed.createComponent(GestorEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
