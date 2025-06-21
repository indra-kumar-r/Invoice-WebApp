export interface GSTItem {
  uuid?: string;
  date?: string;
  invoice_no?: string;
  company_name?: string;
  company_gst_number?: string;
  igst_sales?: number;
  cgst?: number;
  sgst?: number;
  gross_total?: number;
  received_amount?: number;
  received_date?: string;
  igst_grand_total?: number;
  cgst_grand_total?: number;
  gross_grand_total?: number;
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
  gross_grand_total?: number;
}
