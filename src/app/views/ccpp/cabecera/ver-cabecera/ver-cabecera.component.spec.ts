import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCabeceraComponent } from './ver-cabecera.component';

describe('VerCabeceraComponent', () => {
  let component: VerCabeceraComponent;
  let fixture: ComponentFixture<VerCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
