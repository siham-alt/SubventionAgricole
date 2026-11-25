import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDemandesDetail } from './mes-demandes-detail';

describe('MesDemandesDetail', () => {
  let component: MesDemandesDetail;
  let fixture: ComponentFixture<MesDemandesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDemandesDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MesDemandesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
