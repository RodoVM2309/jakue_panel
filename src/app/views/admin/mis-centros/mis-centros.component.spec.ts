import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCentrosComponent } from './mis-centros.component';

describe('MisCentrosComponent', () => {
  let component: MisCentrosComponent;
  let fixture: ComponentFixture<MisCentrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisCentrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
