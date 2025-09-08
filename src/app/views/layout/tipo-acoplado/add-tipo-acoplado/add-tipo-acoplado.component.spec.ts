import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipoAcopladoComponent } from './add-tipo-acoplado.component';

describe('AddTipoAcopladoComponent', () => {
  let component: AddTipoAcopladoComponent;
  let fixture: ComponentFixture<AddTipoAcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoAcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoAcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
