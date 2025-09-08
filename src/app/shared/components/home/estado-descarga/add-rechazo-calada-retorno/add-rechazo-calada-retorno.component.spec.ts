import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRechazoCaladaRetornoComponent } from './add-rechazo-calada-retorno.component';

describe('AddEstadoDescargaComponent', () => {
  let component: AddRechazoCaladaRetornoComponent;
  let fixture: ComponentFixture<AddRechazoCaladaRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRechazoCaladaRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRechazoCaladaRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
