import { PDFDocument, rgb } from 'pdf-lib';

export async function generatePDF(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  page.drawText('Monthly Expense Summary', { x: 50, y: 750, size: 18 });

  let y = 700;
  data.forEach((item: any) => {
    page.drawText(`${item.date} - ${item.category}: ₹${item.amount}`, {
      x: 50,
      y,
      size: 12,
    });
    y -= 20;
  });

  return await pdfDoc.save();
}
