import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCargaDestinoComponent } from './confirm-carga-destino.component';

describe('ConfirmCargaDestinoComponent', () => {
  let component: ConfirmCargaDestinoComponent;
  let fixture: ComponentFixture<ConfirmCargaDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCargaDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCargaDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
