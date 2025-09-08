import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTurneadoComponent } from './lista-turneado.component';

describe('ListaTurneadoComponent', () => {
  let component: ListaTurneadoComponent;
  let fixture: ComponentFixture<ListaTurneadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTurneadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTurneadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
