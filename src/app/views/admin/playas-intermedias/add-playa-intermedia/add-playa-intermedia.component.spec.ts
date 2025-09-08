import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayaIntermediaComponent } from './add-playa-intermedia.component';

describe('AddPlayaIntermediaComponent', () => {
  let component: AddPlayaIntermediaComponent;
  let fixture: ComponentFixture<AddPlayaIntermediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayaIntermediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayaIntermediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
