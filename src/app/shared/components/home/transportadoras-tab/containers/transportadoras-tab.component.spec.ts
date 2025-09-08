/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportadorasTabComponent } from '../transportadoras-tab.component';

describe('TransportadorasTabComponent', () => {
  let component: TransportadorasTabComponent;
  let fixture: ComponentFixture<TransportadorasTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransportadorasTabComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportadorasTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
