import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariarKmComponent } from './variar-km.component';

describe('VariarKmComponent', () => {
  let component: VariarKmComponent;
  let fixture: ComponentFixture<VariarKmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariarKmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariarKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
