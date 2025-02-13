import Image from "next/image";

export function BoCongThuong() {
  return (
    <div className="">
      <Image
        src="/images/bo-cong-thuong.png"
        alt="Bộ Công Thương"
        width={200}
        height={75}
        className="mt-4"
        unoptimized
      />
      ;
    </div>
  );
}
