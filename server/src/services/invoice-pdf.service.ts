import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import Handlebars from "handlebars";
import puppeteer from "puppeteer";

Handlebars.registerHelper("inc", (value: number) => value + 1);

class InvoicePdfService {
  async generate(data: any): Promise<Buffer> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "../templates/invoice.hbs");
    const cssPath = path.join(__dirname, "../templates/invoice.css");

    const logoUrl = `${process.env.BASE_URL}/public/logo.png`;
    const signatureUrl = `${process.env.BASE_URL}/public/renuka_signature.png`;

    const htmlTemplate = await fs.readFile(templatePath, "utf8");
    const template = Handlebars.compile(htmlTemplate);
    const html = template({
      ...data,
      logoUrl,
      signatureUrl,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html);

      await page.evaluate(() => {
        const images = Array.from(document.images);

        return Promise.all(
          images.map((img) => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }),
        );
      });

      await page.addStyleTag({
        path: cssPath,
      });

      await page.waitForNetworkIdle();

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}

export default new InvoicePdfService();
