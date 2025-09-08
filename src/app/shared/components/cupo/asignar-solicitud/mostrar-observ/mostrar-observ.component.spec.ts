import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarObservComponent } from './mostrar-observ.component';

describe('MostrarObservComponent', () => {
  let component: MostrarObservComponent;
  let fixture: ComponentFixture<MostrarObservComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarObservComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarObservComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
