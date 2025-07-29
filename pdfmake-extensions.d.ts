declare module 'pdfmake/build/pdfmake' {
    const pdfMake: {
      vfs: Record<string, string>;
      addFonts: (fonts: Record<string, Record<string, string>>) => void;
      createPdf: (docDefinition: any) => any;
    };
    export default pdfMake;
  }