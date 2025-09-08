import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoresSorteoComponent } from './ganadores-sorteo.component';

describe('GanadoresSorteoComponent', () => {
  let component: GanadoresSorteoComponent;
  let fixture: ComponentFixture<GanadoresSorteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadoresSorteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadoresSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
