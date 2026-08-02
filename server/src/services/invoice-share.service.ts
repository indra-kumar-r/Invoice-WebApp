import Invoice from "../models/invoice.model.js";
import emailService from "./email.service.js";
import invoicePdfService from "./invoice-pdf.service.js";

class InvoiceShareService {
  async shareInvoice(uuid: string, isSigned: boolean): Promise<void> {
    const invoice = await Invoice.findOne({ uuid });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const company = {
      name: "YASHASH HAND EMBROIDERY",
      address:
        "96/1A, Gopalaiah Building, Muneshwara Nagar, Kammasandra Road, Hebbagodi, Bangalore - 560100",
      gstin: "29BJBPR9780B1ZU",
      phoneNumbers: ["9986883599", "8123474223"],
      conditions: [
        "Goods once sold cannot be taken back or exchanged.",
        "Subject to Bangalore Jurisdictions.",
        "Interest will be charged 24%p.a. if bill not paid within 15 days.",
        "Our responsibility ceases once goods leave our premises.",
      ],
    };

    const pdf = await invoicePdfService.generate({
      invoice: {
        ...invoice.toObject(),
        date: new Date(invoice.date).toLocaleDateString("en-IN"),
      },
      company,
      isSigned,
    });

    const recipients = [
      process.env.EMAIL_1 as string,
      process.env.EMAIL_2 as string,
    ];

    await emailService.sendEmail({
      to: recipients,
      subject: `Invoice ${invoice.invoice_no}`,
      html: `
                <p>
                    Please find the attached invoice.
                </p>

                <table border="1" cellpadding="8" cellspacing="0">
                  <tr>
                      <td><b>Invoice No</b></td>
                      <td>${invoice.invoice_no}</td>
                  </tr>

                  <tr>
                      <td><b>Company</b></td>
                      <td>${invoice.company_name}</td>
                  </tr>

                  <tr>
                      <td><b>Total</b></td>
                      <td>₹ ${invoice.grand_total}</td>
                  </tr>
                </table>

                <br/>
                <br/>

                <p>Regards,</p>
                <b>YHE - Invoice Management System</b>
            `,
      attachments: [
        {
          filename: `Invoice-${invoice.invoice_no}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });
  }
}

export default new InvoiceShareService();
