declare global {
  var pdfMake: { vfs: { [key: string]: string } };
}

declare module '../vfs_fonts' {
  const vfsFonts: { [key: string]: string };
  export default vfsFonts;
}

export {};