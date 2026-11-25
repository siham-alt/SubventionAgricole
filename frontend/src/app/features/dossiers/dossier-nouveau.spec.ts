import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierNouveau } from './dossier-nouveau';

describe('DossierNouveau', () => {
  let component: DossierNouveau;
  let fixture: ComponentFixture<DossierNouveau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierNouveau],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierNouveau);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
