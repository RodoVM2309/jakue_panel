import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferPerdidoComponent } from './chofer-perdido.component';

describe('ChoferPerdidoComponent', () => {
  let component: ChoferPerdidoComponent;
  let fixture: ComponentFixture<ChoferPerdidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoferPerdidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferPerdidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
