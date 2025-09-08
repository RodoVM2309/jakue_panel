import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCabeceraComponent } from './add-cabecera.component';

describe('AddCabeceraComponent', () => {
  let component: AddCabeceraComponent;
  let fixture: ComponentFixture<AddCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
