import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionCupoComponent } from './informacion-cupo.component';

describe('InformacionCupoComponent', () => {
  let component: InformacionCupoComponent;
  let fixture: ComponentFixture<InformacionCupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionCupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
