import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipoDestinoComponent } from './add-tipo-destino.component';

describe('AddTipoDestinoComponent', () => {
  let component: AddTipoDestinoComponent;
  let fixture: ComponentFixture<AddTipoDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
