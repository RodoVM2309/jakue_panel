import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCargaComponent } from './confirm-carga.component';

describe('ConfirmCargaComponent', () => {
  let component: ConfirmCargaComponent;
  let fixture: ComponentFixture<ConfirmCargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCargaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
