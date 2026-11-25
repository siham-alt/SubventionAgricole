import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesListe } from './demandes-liste';

describe('DemandesListe', () => {
  let component: DemandesListe;
  let fixture: ComponentFixture<DemandesListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesListe],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandesListe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
