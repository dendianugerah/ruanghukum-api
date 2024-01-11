import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "700",
  preload: false,
});

export default function Navbar() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href="/">
          <div className={poppins.className}>
            <h1 className="text-2xl font-bold">RuangHukum</h1>
          </div>
        </Link>
        <div className="flex items-center text-md bg-[#F5F7F8] rounded-2xl">
          <NavLink href="/" text="Berita Terbaru" />
          <NavLink href="/" text="Layanan Kami" />
          <NavLink href="/" text="Konsultasi Hukum Gratis" />
        </div>
      </div>
    </div>
  );
}

const NavLink = ({ href, text }: { href: string, text: string }) => (
  <Link href={href} passHref>
    <h1 className="mx-4 my-2 hover:font-medium">{text}</h1>
  </Link>
);
