import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center animate-bounce gap-2">
        <Image
          src="/images/logo-fix.png"
          alt="Loading..."
          width={100}
          height={100}
          loading="eager"
        />
      </div>
    </div>
  );
}
