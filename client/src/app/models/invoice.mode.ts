export interface Invoice {
  uuid: string;
  invoice_no: string;
  company_name?: string;
  company_address?: string;
  company_gst_no?: string;
  date?: string;
  dc_nos: string[];
  order_nos: string[];
  invoice_items: InvoiceItem[];
  total?: number;
  sgst?: number;
  cgst?: number;
  igst?: number;
  grand_total?: number;
  amount_in_words?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  uuid: string;
  sl_no: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceQuery {
  search?: string;
  page?: number;
}

export interface InvoiceResponse {
  data: Invoice[];
  total: number;
  page: number;
  totalPages: number;
}
