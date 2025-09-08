import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCupoComponent } from './detalle-cupo.component';

describe('DetalleCupoComponent', () => {
  let component: DetalleCupoComponent;
  let fixture: ComponentFixture<DetalleCupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
