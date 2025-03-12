import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};
export default function NotFound() {
  return (
    <div className="px-2 w-full">
      <div className="flex flex-col mx-auto mt-20 py-4 justify-center items-center gap-4">
        <Image
          className="m-0 rounded-xl"
          src="/images/not-found.svg"
          width={650}
          height={650}
          sizes="300px"
          alt="Page Not Found"
          priority={true}
          title="Page Not Found"
        />
        <h2 className="text-2xl">404 - Page Not Found</h2>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <Link href="/tickets" className="text-center hover:underline">
            <h3>Go Home</h3>
          </Link>
        </Button>
      </div>
    </div>
  );
}
