import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferVencidoComponent } from './chofer-vencido.component';

describe('ChoferVencidoComponent', () => {
  let component: ChoferVencidoComponent;
  let fixture: ComponentFixture<ChoferVencidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoferVencidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferVencidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
