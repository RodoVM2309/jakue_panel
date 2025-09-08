import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDesvioMotivoComponent } from './add-desvio-motivo.component';

describe('AddDesvioMotivoComponent', () => {
  let component: AddDesvioMotivoComponent;
  let fixture: ComponentFixture<AddDesvioMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDesvioMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDesvioMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
