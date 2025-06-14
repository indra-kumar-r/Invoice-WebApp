import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Invoice } from '../../../models/invoice.mode';
import { InvoiceApiRoutes } from '../../constants/api-routes-constants';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private api: HttpService) {}

  createInvoice(invoice: any): Observable<Invoice> {
    return this.api.post<Invoice>(InvoiceApiRoutes.CREATE, invoice);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.api.get<Invoice[]>(InvoiceApiRoutes.GET_ALL);
  }

  getInvoice(uuid: string): Observable<Invoice> {
    return this.api.get<Invoice>(
      InvoiceApiRoutes.GET_BY_UUID.replace(':uuid', uuid)
    );
  }

  updateInvoice(uuid: string, invoice: Invoice): Observable<Invoice> {
    return this.api.put<Invoice>(
      InvoiceApiRoutes.UPDATE.replace(':uuid', uuid),
      invoice
    );
  }

  deleteInvoice(uuid: string): Observable<Invoice> {
    return this.api.delete<Invoice>(
      InvoiceApiRoutes.DELETE.replace(':uuid', uuid)
    );
  }
}
