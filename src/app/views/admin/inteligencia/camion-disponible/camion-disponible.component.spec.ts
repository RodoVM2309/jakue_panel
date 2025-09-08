import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamionDisponibleComponent } from './camion-disponible.component';

describe('CamionDisponibleComponent', () => {
  let component: CamionDisponibleComponent;
  let fixture: ComponentFixture<CamionDisponibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamionDisponibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
