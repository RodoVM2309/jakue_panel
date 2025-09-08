import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarIntermediariosComponent } from './asignar-intermediarios.component';

describe('AsignarIntermediariosComponent', () => {
  let component: AsignarIntermediariosComponent;
  let fixture: ComponentFixture<AsignarIntermediariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarIntermediariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarIntermediariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
