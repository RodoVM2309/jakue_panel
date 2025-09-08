import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarcaAcopladoComponent } from './add-marca-acoplado.component';

describe('AddMarcaAcopladoComponent', () => {
  let component: AddMarcaAcopladoComponent;
  let fixture: ComponentFixture<AddMarcaAcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarcaAcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarcaAcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
