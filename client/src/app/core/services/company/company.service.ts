import { Injectable } from '@angular/core';
import { Company } from '../../../models/company.model';
import { Observable } from 'rxjs';
import { CompanyApiRoutes } from '../../constants/api-routes-constants';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private api: HttpService) {}

  createCompany(company: Company): Observable<Company> {
    return this.api.post<Company>(CompanyApiRoutes.CREATE, company);
  }

  getCompanies(): Observable<Company[]> {
    return this.api.get<Company[]>(CompanyApiRoutes.GET_ALL);
  }

  getCompany(uuid: string): Observable<Company> {
    return this.api.get<Company>(
      CompanyApiRoutes.GET_BY_UUID.replace(':uuid', uuid)
    );
  }

  updateCompany(uuid: string, company: Company): Observable<Company> {
    return this.api.put<Company>(
      CompanyApiRoutes.UPDATE.replace(':uuid', uuid),
      company
    );
  }

  deleteCompany(uuid: string): Observable<Company> {
    return this.api.delete<Company>(
      CompanyApiRoutes.DELETE.replace(':uuid', uuid)
    );
  }
}
