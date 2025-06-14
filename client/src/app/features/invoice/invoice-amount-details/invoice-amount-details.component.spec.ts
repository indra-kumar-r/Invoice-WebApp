import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAmountDetailsComponent } from './invoice-amount-details.component';

describe('InvoiceAmountDetailsComponent', () => {
  let component: InvoiceAmountDetailsComponent;
  let fixture: ComponentFixture<InvoiceAmountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAmountDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
