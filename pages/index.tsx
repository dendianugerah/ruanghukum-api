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

          <h1 className="text-2xl">Berita terbaru</h1>
          <Blog blogs={blogs} />

          <h1 className="text-2xl">Layanan Kami</h1>
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
