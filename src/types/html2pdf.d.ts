declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number[];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: any;
    jsPDF?: any;
  }

  interface Html2PdfInstance {
    from: (element: HTMLElement) => {
      save: (options?: Html2PdfOptions) => void;
    };
    set: (options: Html2PdfOptions) => Html2PdfInstance;
  }

  function html2pdf(): Html2PdfInstance;

  export = html2pdf;
}
