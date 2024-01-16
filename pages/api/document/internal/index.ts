import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "drizzle-orm";
import { Response } from "@/src/helper/apiResponse";
import { bucket } from "@/src/config/gcs";
import { v4 as uuid } from "uuid";
import PDFDocument from "pdfkit";
import db, { document } from "@/src/config/db";
import fs from "fs";
import withAuth from "@/middleware";

interface DocumentApiInternalRequest extends NextApiRequest {
  body: {
    title: string;
    sewaRuko: {
      alamat: string;
      nomor_hak_milik: string;
      luas: string;
      daya_listrik: string;
      sumber_air: string;
      biaya: {
        harga_sewa: string;
        jangka_waktu: string;
        tanggal_mulai: string;
        tanggal_berakhir: string;
      };
    };
    penyewa: {
      nama: string;
      tempat_ttl: string;
      no_ktp: string;
      pekerjaan: string;
      alamat: string;
    };
  };
  query: {
    category: string;
  };
}

async function handler(req: DocumentApiInternalRequest, res: NextApiResponse) {
  const doc = new PDFDocument();
  const pdfFileName = `${uuid()}-output.pdf`;
  const pdfPath = `/tmp/${pdfFileName}`;
  doc.pipe(fs.createWriteStream(pdfPath));

  let userId = req.userId;

  await db.insert(document).values({
    id: uuid(),
    userId: userId as string,
    name: req.body.title,
    path: `https://storage.googleapis.com/bebasss/pdf-documents/${pdfFileName}`,
  });

  if (req.method === "POST") {
    const { category } = req.query;
    const { sewaRuko, penyewa } = req.body;

    try {
      if (category === "sewa-ruko") {
        createHeader(doc, "SURAT PERJANJIAN SEWA-MENYEWA RUKO");

        doc.fontSize(12);
        doc.font("Times-Roman");

        doc.text(
          `Pada hari ini, ${new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}, kami yang bertanda tangan di bawah ini:`
        );

        doc.moveDown();

        doc.list(
          [
            `Nama                           : ${penyewa.nama}`,
            `Tempat/Tanggal Lahir : ${penyewa.tempat_ttl}`,
            `Pekerjaan                     : ${penyewa.pekerjaan}`,
            `Alamat                         : ${penyewa.alamat}`,
            `Nomor KTP                 : ${penyewa.no_ktp}`,
          ],
          {
            bulletRadius: 2,
            textIndent: 10,
            indent: 20,
          }
        );

        doc.moveDown();

        doc.text(
          "Dalam hal ini bertindak atas nama diri pribadi yang selanjutnya disebut sebagai PIHAK PERTAMA (Pemilik)"
        );

        doc.moveDown();

        const users = await db.execute(
          sql`SELECT * FROM public.user WHERE id = ${req.userId}`
        );

        doc.list(
          [
            `Nama                           : ${users[0].fullname}`,
            `Tempat/Tanggal Lahir : ${users[0].birth_date}`,
            `Pekerjaan                     : ${users[0].job_title}`,
            `Alamat                         : ${users[0].address}`,
            `Nomor KTP                 : ${users[0].id_card_number}`,
          ],
          {
            bulletRadius: 2,
            textIndent: 10,
            indent: 20,
          }
        );

        doc.moveDown();

        doc.text(
          "Dalam hal ini bertindak atas nama diri pribadi yang selanjutnya disebut sebagai PIHAK KEDUA (Penyewa)",
          {
            paragraphGap: 10,
          }
        );

        doc.list(
          [
            "1. Bahwa PIHAK PERTAMA adalah pemilik yang sah atas sebuah tanah dan bangunan",
          ],
          {
            bulletRadius: 0.01,
            indent: 20,
          }
        );
        doc.list(
          ["dengan detail sebagai berikut (selanjutnya disebut sebagai RUKO)"],
          {
            bulletRadius: 0.01,
            indent: 32,
          }
        );

        doc.list(
          [
            `Alamat Ruko : ${sewaRuko.alamat}`,
            `Nomor Sertifikat Hak Milik : ${sewaRuko.nomor_hak_milik}`,
            `Luas: ${sewaRuko.luas}`,
            `Daya Listrik : ${sewaRuko.daya_listrik}`,
            `Sumber Air : ${sewaRuko.sumber_air}`,
          ],
          {
            indent: 40,
            bulletRadius: 2,
          }
        );

        doc.list(
          [
            "2. Bahwa, PIHAK PERTAMA bermaksud untuk menyewakan Ruko tersebut kepada PIHAK",
          ],
          {
            bulletRadius: 0.01,
            indent: 20,
          }
        );

        doc.list(
          [
            "KEDUA sebagaimana PIHAK KEDUA bermaksud untuk menyewa Ruko tersebut dari",
          ],
          {
            bulletRadius: 0.01,
            indent: 32,
          }
        );
        doc.list(["PIHAK PERTAMA."], {
          bulletRadius: 0.01,
          indent: 32,
        });

        doc.moveDown();

        doc.text(
          `Selanjutnya, untuk maksud tersebut di atas, PARA PIHAK sepakat untuk mengikatkan diri dalam Perjanjian Ruko (selanjutnya disebut “Perjanjian”) ini dengan ketentuan dan syarat-syarat sebagaimana diatur pasal-pasal di bawah ini:`,
          {
            indent: 0,
            align: "justify",
            paragraphGap: 10,
          }
        );
        doc.moveDown();

        doc.fontSize(12);
        doc.text("PASAL 1", {
          align: "center",
          paragraphGap: 10,
        });
        doc.text("KESEPAKATAN SEWA-MENYEWA", {
          align: "center",
          paragraphGap: 10,
        });

        // --------------------- ISI PASAL 1 ---------------------

        doc.list(
          [
            "1. PIHAK PERTAMA dengan ini sepakat untuk menyewakan Ruko kepada PIHAK KEDUA",
          ],
          {
            bulletRadius: 0.01,
            indent: 20,
          }
        );
        doc.list(
          [
            "sebagaimana PIHAK KEDUA dengan ini sepakat untuk menyewa Ruko tersebut dari",
          ],
          {
            bulletRadius: 0.01,
            indent: 32,
          }
        );
        doc.list(["PIHAK PERTAMA."], {
          bulletRadius: 0.01,
          indent: 32,
        });

        doc.list(
          [
            "2. Sewa menyewa Ruko sebagaimana dimaksud ayat (1) dilaksanakan dengan ketentuan",
          ],
          {
            bulletRadius: 0.01,
            indent: 20,
          }
        );

        doc.list(["sebagai berikut: "], {
          bulletRadius: 0.01,
          indent: 32,
        });

        doc.list(
          [
            `a. Harga sewa Ruko adalah sebesar Rp. ${sewaRuko.biaya.harga_sewa}`,
          ],
          {
            bulletRadius: 0.01,
            indent: 40,
          }
        );

        doc.list(
          [
            `b. Jangka Waktu Sewa adalah untuk selama ${sewaRuko.biaya.jangka_waktu}`,
          ],
          {
            bulletRadius: 0.01,
            indent: 40,
          }
        );

        doc.moveDown();

        doc.fontSize(12);
        doc.text("PASAL 2", {
          align: "center",
          paragraphGap: 10,
        });
        doc.text("HARGA DAN PEMBAYARAN", {
          align: "center",
          paragraphGap: 10,
        });

        // --------------------- ISI PASAL 2 ---------------------

        // --------------------- End of doc ---------------------
        doc.moveDown();
        doc.moveDown();
        doc.text("Demikianlah ", { continued: true });
        doc.font("Times-Bold");
        doc.text("Surat Perjanjian Sewa Ruko ", { continued: true });
        doc.font("Times-Roman");
        doc.text(
          `ini dibuat dalam 2 (dua) rangkap yang bermaterai cukup dan mempunyai kekuatan hukum yang sama, ditandatangani kedua belah pihak pada ${new Date().toLocaleDateString(
            "id-ID",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}, dan berlaku sejak tanggal tersebut.`,
          {
            align: "justify",
          }
        );

        doc.moveDown();
        doc.font("Times-Bold");
        doc.text("PIHAK PERTAMA", {
          align: "left",
          continued: true,
        });

        doc.text("PIHAK KEDUA", {
          align: "right",
        });

        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();

        doc.text(`(${users[0].fullname})`, {
          align: "left",
          continued: true,
        });

        doc.text(`(${penyewa.nama})`, {
          align: "right",
        });
      }

      doc.end();

      await bucket.upload(pdfPath, {
        destination: `pdf-documents/${pdfFileName}`,
      });

      fs.promises.unlink(pdfPath);

      return Response(res, 200, "Success", {
        type: "document - sewa-ruko",
        payload: {
          title: req.body.title,
          path: `https://storage.googleapis.com/bebasss/pdf-documents/${pdfFileName}`,
        },
      });
    } catch (error) {
      return Response(res, 500, "Internal Server Error", {
        type: "document - sewa-ruko",
        error: error,
      });
    }
  } else if (req.method === "GET") {
    const data = await db.execute(
      sql`SELECT * FROM public.document WHERE user_id = ${req.userId} ORDER BY created_at DESC`
    );

    if (!data.length) {
      return Response(res, 404, "Not Found", {
        type: "document - sewa-ruko",
        error: "data not found",
      });
    }

    return Response(res, 200, "Success", {
      type: "document - sewa-ruko",
      payload: data,
    });
  } else {
    return Response(res, 405, "Method Not Allowed", {
      type: "document - sewa-ruko",
      error: "method not allowed",
    });
  }
}

function createHeader(doc: typeof PDFDocument, title: string) {
  doc.lineGap(1.5);
  doc.fontSize(20);
  doc.font("Times-Bold");
  doc.text(title, { align: "center" });
  doc.moveDown();
}

export default withAuth(handler);
