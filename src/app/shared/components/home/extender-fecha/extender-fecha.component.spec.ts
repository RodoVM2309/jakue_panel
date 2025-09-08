import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtenderFechaComponent } from './extender-fecha.component';

describe('ExtenderFechaComponent', () => {
  let component: ExtenderFechaComponent;
  let fixture: ComponentFixture<ExtenderFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtenderFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtenderFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
