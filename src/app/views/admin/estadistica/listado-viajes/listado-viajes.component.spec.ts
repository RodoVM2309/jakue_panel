import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoViajesComponent } from './listado-viajes.component';

describe('ListadoViajesComponent', () => {
  let component: ListadoViajesComponent;
  let fixture: ComponentFixture<ListadoViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
