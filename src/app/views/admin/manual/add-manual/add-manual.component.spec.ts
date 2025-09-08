import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualComponent } from './add-manual.component';

describe('AddManualComponent', () => {
  let component: AddManualComponent;
  let fixture: ComponentFixture<AddManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
