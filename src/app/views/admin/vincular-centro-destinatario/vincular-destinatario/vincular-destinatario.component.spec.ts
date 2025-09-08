import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularDestinatarioComponent } from './vincular-destinatario.component';

describe('VincularDestinatarioComponent', () => {
  let component: VincularDestinatarioComponent;
  let fixture: ComponentFixture<VincularDestinatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularDestinatarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
