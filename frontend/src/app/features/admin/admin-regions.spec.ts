import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegions } from './admin-regions';

describe('AdminRegions', () => {
  let component: AdminRegions;
  let fixture: ComponentFixture<AdminRegions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegions],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRegions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
