import Image from "next/image";

import Hero from "@/components/landing/hero"
import Recent from "@/components/landing/recent";
import Mark from "@/components/landing/marketing"

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Recent />
      <Mark />
    </main>
  );
}
