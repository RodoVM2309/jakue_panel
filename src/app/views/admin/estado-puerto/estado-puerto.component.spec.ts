import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPuertoComponent } from './estado-puerto.component';

describe('EstadoPuertoComponent', () => {
  let component: EstadoPuertoComponent;
  let fixture: ComponentFixture<EstadoPuertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoPuertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoPuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
