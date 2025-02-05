import Image from "next/image";

export function Logo() {
  return (
    <div className="w-24 h-24 relative">
      <Image
        src="/Images/logo.png"
        alt="SPL Logo"
        width={96}
        height={96}
        className="rounded-full"
        unoptimized
      />
    </div>
  );
}
