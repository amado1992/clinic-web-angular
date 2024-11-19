export function getDocumentDefinition(): any {
  const pdfDefinition: any = {
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [5, 10, 5, 10],
    content: [
      {
        text: 'RESUMEN',
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [35, 0, 35, 20]
      },
      { canvas: [{ type: 'line', x1: 0 + 20, y1: 5, x2: 585 - 20, y2: 5, lineWidth: 1 }] }
    ],
    info: {
      title: 'RESUMEN',
      author: 'JNBA',
      subject: 'RESUMEN',
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 20, 0, 10],
        decoration: 'underline'
      },
      name: {
        fontSize: 16,
        bold: true
      },
      jobTitle: {
        fontSize: 14,
        bold: true,
        italics: true
      },
      sign: {
        margin: [0, 50, 0, 10],
        alignment: 'right',
        italics: true
      },
      tableHeader: {
        bold: true,
      },
      tableExample: {
        margin: [10, 5, 10, 15]
      },
      thinTableHeader: {
        bold: true,
        fontSize: 11
      },
      thinTableBody: {
        fontSize: 8
      }
    }
  };
  return pdfDefinition;
}