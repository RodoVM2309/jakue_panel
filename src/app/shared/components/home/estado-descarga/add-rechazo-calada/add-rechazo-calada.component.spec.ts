import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRechazoCaladaComponent } from './add-rechazo-calada.component';

describe('AddEstadoDescargaComponent', () => {
  let component: AddRechazoCaladaComponent;
  let fixture: ComponentFixture<AddRechazoCaladaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRechazoCaladaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRechazoCaladaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
