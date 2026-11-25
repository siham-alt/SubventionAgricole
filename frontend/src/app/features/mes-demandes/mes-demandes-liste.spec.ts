import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDemandesListe } from './mes-demandes-liste';

describe('MesDemandesListe', () => {
  let component: MesDemandesListe;
  let fixture: ComponentFixture<MesDemandesListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDemandesListe],
    }).compileComponents();

    fixture = TestBed.createComponent(MesDemandesListe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
