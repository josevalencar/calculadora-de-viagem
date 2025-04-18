import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="w-full py-8 px-4 flex justify-center items-center">
      <div className="w-[300px] relative">
        <Image
          src="/ha-terraplanagem-logo.png"
          alt="HA Terraplanagem Logo"
          width={300}
          height={100}
          priority
          className="object-contain"
        />
      </div>
    </header>
  );
} 