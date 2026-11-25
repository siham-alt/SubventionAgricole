import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRapports } from './admin-rapports';

describe('AdminRapports', () => {
  let component: AdminRapports;
  let fixture: ComponentFixture<AdminRapports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRapports],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRapports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
