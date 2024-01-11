import Link from "next/link";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: "700",
  preload: false,
});

export default function Navbar() {
  return (
    <div className={poppins.className}>
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold">RuangHukum</h1>
        </Link>
      </div>
    </div>
  );
}
