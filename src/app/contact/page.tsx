"use client";

import { ContactHero } from "./contac-hero";
import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-infor";
import { Map } from "./map";

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
