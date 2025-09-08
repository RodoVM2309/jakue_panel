import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesCupoComponent } from './solicitudes-cupo.component';

describe('SolicitudesCupoComponent', () => {
  let component: SolicitudesCupoComponent;
  let fixture: ComponentFixture<SolicitudesCupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesCupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
