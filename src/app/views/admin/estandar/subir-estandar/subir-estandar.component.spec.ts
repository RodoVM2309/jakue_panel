import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirEstandarComponent } from './subir-estandar.component';

describe('SubirEstandarComponent', () => {
  let component: SubirEstandarComponent;
  let fixture: ComponentFixture<SubirEstandarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirEstandarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirEstandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
