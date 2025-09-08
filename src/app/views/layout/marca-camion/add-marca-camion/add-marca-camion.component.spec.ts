import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarcaCamionComponent } from './add-marca-camion.component';

describe('AddMarcaCamionComponent', () => {
  let component: AddMarcaCamionComponent;
  let fixture: ComponentFixture<AddMarcaCamionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarcaCamionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarcaCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
