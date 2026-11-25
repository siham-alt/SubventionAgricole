import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgrammes } from './admin-programmes';

describe('AdminProgrammes', () => {
  let component: AdminProgrammes;
  let fixture: ComponentFixture<AdminProgrammes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgrammes],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProgrammes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
