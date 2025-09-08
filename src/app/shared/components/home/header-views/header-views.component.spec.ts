import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderViewsComponent } from './header-views.component';

describe('HeaderViewsComponent', () => {
  let component: HeaderViewsComponent;
  let fixture: ComponentFixture<HeaderViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
