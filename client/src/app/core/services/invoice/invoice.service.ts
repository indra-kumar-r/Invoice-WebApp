import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import {
  Invoice,
  InvoiceQuery,
  InvoiceResponse,
} from '../../../models/invoice.mode';
import { InvoiceApiRoutes } from '../../constants/api-routes-constants';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private api: HttpService) {}

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.api.post<Invoice>(InvoiceApiRoutes.CREATE, invoice);
  }

  getInvoices(query: InvoiceQuery): Observable<InvoiceResponse> {
    const params: InvoiceQuery = {
      page: query.page || 1,
      search: query?.search ?? '',
    };

    const url = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return this.api.get<InvoiceResponse>(InvoiceApiRoutes.GET_ALL + '?' + url);
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
