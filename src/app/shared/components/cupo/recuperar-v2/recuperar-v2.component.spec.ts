import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarV2Component } from './recuperar-v2.component';

describe('RecuperarV2Component', () => {
  let component: RecuperarV2Component;
  let fixture: ComponentFixture<RecuperarV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
