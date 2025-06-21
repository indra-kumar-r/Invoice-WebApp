import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstsComponent } from './gsts.component';

describe('GstsComponent', () => {
  let component: GstsComponent;
  let fixture: ComponentFixture<GstsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
