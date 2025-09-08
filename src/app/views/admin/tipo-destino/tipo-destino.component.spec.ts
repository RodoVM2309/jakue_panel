import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDestinoComponent } from './tipo-destino.component';

describe('TipoDestinoComponent', () => {
  let component: TipoDestinoComponent;
  let fixture: ComponentFixture<TipoDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
