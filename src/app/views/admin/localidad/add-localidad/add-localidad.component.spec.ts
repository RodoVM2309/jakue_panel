import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalidadComponent } from './add-localidad.component';

describe('AddLocalidadComponent', () => {
  let component: AddLocalidadComponent;
  let fixture: ComponentFixture<AddLocalidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLocalidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
