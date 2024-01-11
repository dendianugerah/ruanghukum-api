import { Rubik } from "next/font/google";
import fs from "fs";
import matter from "gray-matter";
import Blog from "./blog";
import Image from "next/image";
import Link from "next/link";
import RootLayout from "./layout";

const rubik = Rubik({
  preload: false,
});

interface HomeProps {
  blogs: any[];
}
export default function Home({ blogs }: HomeProps) {
  return (
    <main>
      <RootLayout>
        <div className={rubik.className}>
          {/* ISINYA SEMENTARA AKU HARDCODE DISINI  */}

          <div className="grid grid-cols-3 bg-[#F5F7F8] px-4 py-4 rounded-2xl mb-4">
            <h1 className="text-[48px] col-span-2">
              Kami <u>yakin</u> bahwa setiap individu berhak untuk mendapatkan
              akses hukum.
              <div className="mt-8">
                <p className="text-lg">
                  Sumber nomor <b>#1</b> menyediakan solusi lengkap untuk segala
                  permasalahan <br /> hukum di Indonesia. Dapatkan informasi
                  hukum terbaru dan terpercaya, <br /> serta temukan solusi
                  praktis bersama kami.
                </p>
                <h1 className="text-[#2A5EDD] text-lg">
                  <Link href="/download" className="col-span-1 hover:underline">
                    Download aplikasi
                  </Link>
                </h1>
              </div>
            </h1>
            <Image
              src="/assets/homepage.png"
              width={230}
              height={500}
              alt="homepage"
              className="shadow-2xl rounded-xl"
            />
          </div>

          <h1 className="text-2xl py-4 px-4">Layanan Kami</h1>
          <div className="grid grid-cols-3 gap-4 mb-4 text-justify">
            <div className=" p-4">
              <h1 className="text-xl font-bold">
                Bingung dengan Kasus yang Dihadapi?
              </h1>
              <div className=" mx-auto flex mt-2">
                <p className="text-sm text-gray-600 mx-1">
                  Dapatkan konsultasi hukum dari para ahli berpengalaman untuk
                  solusi yang lebih efektif dan cepat.
                </p>
                <Image
                  src="/assets/konsultasi-hukum.png"
                  width={200}
                  height={100}
                  alt="konsultasi"
                  className="shadow-2xl rounded-xl mx-4"
                />
              </div>
            </div>
            <div className=" p-4">
              <h1 className="text-xl font-bold">Atau Ingin Melaporkan?</h1>
              <div className="mx-auto flex mt-2">
                <p className="text-sm text-gray-600 mx-1">
                  Memerlukan bantuan untuk melaporkan kasus yang terjadi? Kami
                  tentu saja akan memberikan bantuan untuk melaporkan kasus yang
                  terjadi.
                </p>
                <Image
                  src="/assets/dokumen-hukum.png"
                  width={200}
                  height={100}
                  alt="dokumen"
                  className="shadow-2xl rounded-xl mx-4"
                />
              </div>
            </div>
            <div className=" p-4">
              <h1 className="text-xl font-bold">RuangHukum Hadir untuk Itu</h1>
              <div className=" mx-auto flex mt-2">
                <p className="text-sm text-gray-600 mx-1">
                  Dapatkan konsultasi hukum kapan saja, 24 jam sehari, 7 hari
                  seminggu, dengan bantuan dari sistem Kecerdasan Buatan yang
                  siap memberi nasihat hukum yang akurat dan relevan terhadap
                  hukum yang berlaku di Indonesia.
                </p>
                <Image
                  src="/assets/nasihat-hukum.png"
                  width={200}
                  height={100}
                  alt="nasihat"
                  className="shadow-2xl rounded-xl mx-4"
                />
              </div>
            </div>
          </div>

          <h1 className="text-2xl px-4 py-4">Berita terbaru</h1>
          <Blog blogs={blogs} />
        </div>
      </RootLayout>
    </main>
  );
}

export async function getStaticProps() {
  let files = fs.readdirSync("pages/blog/data");
  files = files.filter((file) => file.endsWith(".mdx"));

  const blogs = files.map((file) => {
    const fileData = fs.readFileSync(`pages/blog/data/${file}`);

    const { data } = matter(fileData);

    return {
      frontMatter: data,
      slug: file.split(".")[0],
    };
  });

  return {
    props: {
      blogs,
    },
  };
}
