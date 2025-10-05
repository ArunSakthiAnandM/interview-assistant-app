import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrganisation } from './create-organisation';

describe('CreateOrganisation', () => {
  let component: CreateOrganisation;
  let fixture: ComponentFixture<CreateOrganisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrganisation],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrganisation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
