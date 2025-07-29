declare global {
  var pdfMake: { vfs: { [key: string]: string } };
}

declare module '../vfs_fonts' {
  const vfsFonts: { [key: string]: string };
  export default vfsFonts;
}

declare module 'pdfmake/build/pdfmake' {
  const pdfMake: any;
  export default pdfMake;
}

export {};