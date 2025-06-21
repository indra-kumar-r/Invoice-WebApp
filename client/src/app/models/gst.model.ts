export interface GSTItem {
  uuid?: string;
  date?: string;
  invoice_no?: string;
  company_name?: string;
  company_gst_number?: string;
  igst?: number;
  cgst?: number;
  sgst?: number;
  total?: number;
}

export interface GST {
  uuid?: string;
  month_name?: string;
  year?: number;
  gst_items?: GSTItem[];
  created_at?: string;
  updated_at?: string;
}

export interface GSTRecords {
  uuid?: string;
  month_name?: string;
  year?: number;
  total?: number;
}
