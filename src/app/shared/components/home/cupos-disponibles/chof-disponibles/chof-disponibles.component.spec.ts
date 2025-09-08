import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChofDisponiblesComponent } from './chof-disponibles.component';

describe('ChofDisponiblesComponent', () => {
  let component: ChofDisponiblesComponent;
  let fixture: ComponentFixture<ChofDisponiblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChofDisponiblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChofDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
