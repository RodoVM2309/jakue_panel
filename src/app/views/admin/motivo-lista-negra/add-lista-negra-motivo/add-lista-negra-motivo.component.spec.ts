import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListaNegraMotivoComponent } from './add-lista-negra-motivo.component';

describe('AddListaNegraMotivoComponent', () => {
  let component: AddListaNegraMotivoComponent;
  let fixture: ComponentFixture<AddListaNegraMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddListaNegraMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListaNegraMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
