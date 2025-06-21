import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGstsComponent } from './manage-gsts.component';

describe('ManageGstsComponent', () => {
  let component: ManageGstsComponent;
  let fixture: ComponentFixture<ManageGstsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGstsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
