import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeNouvelle } from './demande-nouvelle';

describe('DemandeNouvelle', () => {
  let component: DemandeNouvelle;
  let fixture: ComponentFixture<DemandeNouvelle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeNouvelle],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandeNouvelle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
