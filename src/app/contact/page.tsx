import { Metadata } from "next";
import { ContactHero } from "./contac-hero";
import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-infor";
import { Map } from "./map";
import { defaultMetadata } from "../_utils/metadata";
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Liên hệ | Song Phát Long",
  description:
    "Liên hệ với Song Phát Long để được tư vấn về sản phẩm và dịch vụ PCCC",
};
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#87CEEB] via-white to-[#F7E987]">
      <ContactHero />
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      <Map />
    </main>
  );
}
