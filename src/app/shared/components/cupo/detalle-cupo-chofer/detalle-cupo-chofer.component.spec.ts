import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCupoChoferComponent } from './detalle-cupo-chofer.component';

describe('DetalleCupoChoferComponent', () => {
  let component: DetalleCupoChoferComponent;
  let fixture: ComponentFixture<DetalleCupoChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCupoChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCupoChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
