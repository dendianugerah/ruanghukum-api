import React from "react";
import Navbar from "@/components/Layout/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <Navbar />  
      <div className="my-[16px]">{children}</div>
      <div>
        <h1>DISINI FOOTER</h1>
      </div>
    </div>
  );
}
