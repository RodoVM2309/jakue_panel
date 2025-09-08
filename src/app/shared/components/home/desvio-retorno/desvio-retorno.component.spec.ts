import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesvioRetornoComponent } from './desvio-retorno.component';

describe('DesvioComponent', () => {
  let component: DesvioRetornoComponent;
  let fixture: ComponentFixture<DesvioRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesvioRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesvioRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
