import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroDestinatarioComponent } from './vincular-centro-destinatario.component';

describe('VincularCentroDestinatarioComponent', () => {
  let component: VincularCentroDestinatarioComponent;
  let fixture: ComponentFixture<VincularCentroDestinatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroDestinatarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
