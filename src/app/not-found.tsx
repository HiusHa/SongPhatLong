// Sửa file not-found.tsx để loại bỏ metadata viewport
import type { Metadata } from "next";
import { defaultMetadata } from "./_utils/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Không tìm thấy trang | Song Phát Long",
  description: "Trang bạn đang tìm kiếm không tồn tại",
};

// Phần còn lại của component

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
