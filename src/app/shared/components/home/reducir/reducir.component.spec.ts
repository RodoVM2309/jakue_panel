import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReducirComponent } from './reducir.component';

describe('ReducirComponent', () => {
  let component: ReducirComponent;
  let fixture: ComponentFixture<ReducirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReducirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReducirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
