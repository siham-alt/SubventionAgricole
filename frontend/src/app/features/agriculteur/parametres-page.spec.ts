import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametresPage } from './parametres-page';

describe('ParametresPage', () => {
  let component: ParametresPage;
  let fixture: ComponentFixture<ParametresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametresPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ParametresPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
