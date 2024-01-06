import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import PDFDocument from "pdfkit";
import withAuth from "@/middleware";

// still figuring out the template for each case (category): and then after that, i will refactor all this code

interface DocumentApiRequest extends NextApiRequest {
  body: {
    data: string;
    pelapor: {
      nama: string;
      tempat_ttl: string;
      no_ktp: string;
      pekerjaan: string;
      jenis_kelamin: string;
      alamat: string;
    };
    terlapor: {
      nama: string;
      pekerjaan: string;
      no_telepon: string;
      jenis_kelamin: string;
      alamat: string;
    };
    instansi: {
      nama: string;
      alamat: string;
    };
  };
  query: {
    category: string;
  };
}

async function handler(req: DocumentApiRequest, res: NextApiResponse<any>) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("output.pdf"));

  if (req.method === "POST") {
    const { data } = req.body;
    const { pelapor, terlapor, instansi } = req.body;
    const { category } = req.query;

    try {
      doc.text("Hal: Laporan Tindah Pidana Penipuan Hutang Piutang");
      doc.text("Lampiran: 1 (satu) berkas");

      doc.moveDown();
      doc.text("Kepada Yth.");
      doc.text(instansi.nama);
      doc.text(`Di ${instansi.alamat}`);

      doc.moveDown();
      doc.text("Dengan hormat,");
      doc.text(`Saya yang bertanda tangan di bawah ini:`);
      doc.moveDown();
      doc.text(`Nama`, { continued: true });
      doc.text(`: ${pelapor.nama}`, {});
      doc.text(`Tempat/Tanggal Lahir: ${pelapor.tempat_ttl}`);
      doc.text(`No. KTP: ${pelapor.no_ktp}`);
      doc.text(`Pekerjaan: ${pelapor.pekerjaan}`);
      doc.text(`Jenis Kelamin: ${pelapor.jenis_kelamin}`);
      doc.text(`Alamat: ${pelapor.alamat}`);

      doc.moveDown();
      doc.text(`Dengan ini melaporkan:`);
      doc.text(`Nama: ${terlapor.nama}`);
      doc.text(`Pekerjaan: ${terlapor.pekerjaan}`);
      doc.text(`No. Telepon: ${terlapor.no_telepon}`);
      doc.text(`Jenis Kelamin: ${terlapor.jenis_kelamin}`);
      doc.text(`Alamat: ${terlapor.alamat}`);
      doc.moveDown();

      if (category === "laporan") {
      }

      if (category === "pengaduan") {
        doc.text(
          `Bahwa saya telah melakukan pembayaran sebesar ${data} kepada saudara ${
            terlapor.nama
          } pada tanggal ${new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} melalui ${
            pelapor.pekerjaan
          } yang saya jalani. Namun, hingga saat ini saudara ${
            terlapor.nama
          } belum menyelesaikan hutang piutang tersebut. Saya telah mencoba menghubungi saudara ${
            terlapor.nama
          } melalui nomor telepon ${
            terlapor.no_telepon
          } namun tidak dapat dihubungi.`,
          {
            align: "justify",
          }
        );
      }

      doc.text(
        `Saudara ${
          terlapor.nama
        } telah melakukan tindak pidana penipuan hutang piutang terhadap saya. Saya telah melakukan pembayaran sebesar ${data} kepada saudara ${
          terlapor.nama
        } pada tanggal ${new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })} melalui ${
          pelapor.pekerjaan
        } yang saya jalani. Namun, hingga saat ini saudara ${
          terlapor.nama
        } belum menyelesaikan hutang piutang tersebut.`,
        {
          align: "justify",
        }
      );

      doc.end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }

    res.status(200).json("Success");
  } else {
    res.status(405).end();
  }
}

export default withAuth(handler);
