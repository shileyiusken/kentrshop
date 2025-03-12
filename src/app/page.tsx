import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-[url(/images/home-img.jpg)] bg-cover bg-center">
      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
        <div className="flex flex-col gap-6 p-10 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl">
          <h1 className="text-4xl font-bold">
            Kent&apos;s Computer <br />
            Repair Shop
          </h1>
          <address>
            Lot 2354 Taman Li Hua <br />
            Mukah City, SWK 96400
          </address>
          <p>Open Daily: 9am to 5pm</p>
          <Link href="tel:0168825069" className="hover:underline">
            016-8825069
          </Link>
        </div>
      </main>
    </div>
  );
}
