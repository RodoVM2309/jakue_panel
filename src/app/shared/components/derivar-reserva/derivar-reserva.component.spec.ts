import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivarReservaComponent } from './derivar-reserva.component';

describe('DerivarReservaComponent', () => {
  let component: DerivarReservaComponent;
  let fixture: ComponentFixture<DerivarReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivarReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
