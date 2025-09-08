import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuposDisponiblesComponent } from './cupos-disponibles.component';

describe('CuposDisponiblesComponent', () => {
  let component: CuposDisponiblesComponent;
  let fixture: ComponentFixture<CuposDisponiblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuposDisponiblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuposDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
