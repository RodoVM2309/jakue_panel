import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonRechazoComponent } from './razon-rechazo.component';

describe('RazonRechazoComponent', () => {
  let component: RazonRechazoComponent;
  let fixture: ComponentFixture<RazonRechazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazonRechazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazonRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
