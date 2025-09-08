import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicionComponent } from './posicion.component';

describe('PosicionComponent', () => {
  let component: PosicionComponent;
  let fixture: ComponentFixture<PosicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
