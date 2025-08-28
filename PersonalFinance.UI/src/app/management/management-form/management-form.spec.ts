import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementForm } from './management-form';

describe('ManagementForm', () => {
  let component: ManagementForm;
  let fixture: ComponentFixture<ManagementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
