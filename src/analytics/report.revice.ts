import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Request } from '../request/request.entity';

@Injectable()
export class ReportService {
  generateMonthlyReport(requests: Request[], month: string) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(`monthly_report_${month}.pdf`));

    doc.fontSize(20).text(`Monthly Report for ${month}`, { align: 'center' }).moveDown(0.5);

    requests.forEach((request, index) => {
      doc.fontSize(16).text(`Request ${index + 1}:`, { underline: true }).moveDown(0.5);
      doc.fontSize(12).text(`ID: ${request.id}`);
      doc.fontSize(12).text(`Supplier: ${request.supplier.name}`);
      doc.fontSize(12).text(`Logist: ${request.logist.name}`);
      doc.fontSize(12).text(`Date of Delivery: ${request.dateOfDelivery}`);
      doc.fontSize(12).text(`Address of Delivery: ${request.addressOfDelivery}`);
      doc.fontSize(12).text(`Product Type: ${request.productType}`);
      doc.fontSize(12).text(`Description: ${request.description}`);
      doc.fontSize(12).text(`Status: ${request.status}`);
      doc.moveDown(1);
    });

    doc.end();
  }
}
