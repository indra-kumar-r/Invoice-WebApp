import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { GST, GSTRecords } from '../../../models/gst.model';
import { GstApiRoutes } from '../../constants/api-routes-constants';

@Injectable({
  providedIn: 'root',
})
export class GstService {
  constructor(private api: HttpService) {}

  createGst(gst: GST): Observable<GST> {
    return this.api.post<GST>(GstApiRoutes.CREATE, gst);
  }

  getGsts(): Observable<GSTRecords[]> {
    return this.api.get<GSTRecords[]>(GstApiRoutes.GET_ALL);
  }

  getGst(uuid: string): Observable<GST> {
    const url = GstApiRoutes.GET_BY_UUID.replace(':uuid', uuid);
    return this.api.get<GST>(url);
  }

  updateGst(uuid: string, updatedGst: Partial<GST>): Observable<GST> {
    const url = GstApiRoutes.UPDATE.replace(':uuid', uuid);
    return this.api.put<GST>(url, updatedGst);
  }

  deleteGst(uuid: string): Observable<{ message: string }> {
    const url = GstApiRoutes.DELETE.replace(':uuid', uuid);
    return this.api.delete<{ message: string }>(url);
  }
}
