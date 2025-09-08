import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiaCabeceraComponent } from './copia-cabecera.component';

describe('CopiaCabeceraComponent', () => {
  let component: CopiaCabeceraComponent;
  let fixture: ComponentFixture<CopiaCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopiaCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiaCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
