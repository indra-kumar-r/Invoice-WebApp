import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBasicDetailsComponent } from './invoice-basic-details.component';

describe('InvoiceBasicDetailsComponent', () => {
  let component: InvoiceBasicDetailsComponent;
  let fixture: ComponentFixture<InvoiceBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceBasicDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
