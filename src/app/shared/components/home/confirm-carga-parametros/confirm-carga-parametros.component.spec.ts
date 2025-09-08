import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCargaParametrosComponent } from './confirm-carga-parametros.component';

describe('ConfirmCargaParametrosComponent', () => {
  let component: ConfirmCargaParametrosComponent;
  let fixture: ComponentFixture<ConfirmCargaParametrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCargaParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCargaParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
