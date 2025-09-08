import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCargaRetornoComponent } from './confirm-carga-retorno.component';

describe('ConfirmCargaRetornoComponent', () => {
  let component: ConfirmCargaRetornoComponent;
  let fixture: ComponentFixture<ConfirmCargaRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCargaRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCargaRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
