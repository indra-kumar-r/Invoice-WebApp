import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemsDetailsComponent } from './invoice-items-details.component';

describe('InvoiceItemsDetailsComponent', () => {
  let component: InvoiceItemsDetailsComponent;
  let fixture: ComponentFixture<InvoiceItemsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceItemsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceItemsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
