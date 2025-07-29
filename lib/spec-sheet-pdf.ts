import { formatProductData, FormattedProduct } from './product-formatter';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from '../vfs_fonts';

pdfMake.vfs = vfsFonts;

// Register your fonts with the actual font file names you have in vfs_fonts.js
pdfMake.addFonts({
  HelveticaNeue: {
    normal: 'HelveticaNeueLTStd-Roman.otf',
    bold: 'HelveticaNeueLTStd-Bd.otf',
    italics: 'HelveticaNeueLTStd-Lt.otf',        // Optional
    bolditalics: 'HelveticaNeueLTStd-BdCn.otf'   // Optional
  }
});

export const generateSpecSheetPDF = (product: FormattedProduct) => {
  const specs = product.specifications;

  const docDefinition = {
    content: [
      {
        text: product.productName,
        style: 'header',
      },
      {
        text: `SKU: ${product.sku}`,
      },
      { text: '' }, // Add some spacing
      {
        text: 'Standard Features',
        style: 'subheader',
      },
      {
        ul: product.standardFeatures,
      },
      { text: '' }, // Add some spacing
      {
        text: 'Specifications',
        style: 'subheader',
      },
      {
        table: {
          widths: ['*', '*'], // Two columns, equal width
          body: [
            // Table header
            [{ text: 'Specification', style: 'tableHeader' }, { text: 'Value', style: 'tableHeader' }],
            // Table rows for specifications
            ...Object.entries(specs).map(([key, value]) => [
              { text: key },
              { text: value as string }, // Assuming specification values are strings
            ]),
          ],
        },
        layout: 'lightHorizontalLines', // Add horizontal lines to the table
      },
      { text: '' }, // Add some spacing
      {
        text: 'Product Compliance',
        style: 'subheader',
      },
      {
        ul: product.compliance,
      },
    ],
    defaultStyle:{
      font: 'HelveticaNeue'
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] as [number, number, number, number], // Bottom margin
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5] as [number, number, number, number], // Top and bottom margin
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`${product.sku}_spec_sheet.pdf`);

  return docDefinition;
};
