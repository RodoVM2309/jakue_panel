import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGanadoresSorteoComponent } from './add-ganadores-sorteo.component';

describe('AddGanadoresSorteoComponent', () => {
  let component: AddGanadoresSorteoComponent;
  let fixture: ComponentFixture<AddGanadoresSorteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGanadoresSorteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGanadoresSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
