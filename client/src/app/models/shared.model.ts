export interface Toast {
  id: number;
  message: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  gstin: string;
  phoneNumbers: string[];
  conditions: string[];
}
