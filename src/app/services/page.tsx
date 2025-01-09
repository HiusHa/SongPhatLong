import { Button } from "@/components/ui/button";
import { ServiceCard } from "./service-card";

const services = [
  {
    title: "Personnel Outsourcing",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolor...",
    link: "#",
  },
  {
    title: "Personnel Outsourcing",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolor...",
    link: "#",
  },
  {
    title: "Personnel Outsourcing",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolor...",
    link: "#",
  },
];

export default function FireFightingServicesUpgraded() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <section className="relative bg-gray-900 text-white py-20 px-6">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-r-[100px] border-t-transparent border-r-orange-400"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full transform -translate-x-16 translate-y-16 opacity-50"></div>
          <div className="container mx-auto text-center relative z-10">
            <p className="text-sm uppercase tracking-wider mb-4">
              /our services/
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              A Leading Global Provider
              <br />
              Of Fire Fighting and Prevention
            </h1>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
              Liên hệ ngay
            </Button>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ServiceCard {...services[0]} />
              <ServiceCard {...services[1]} />
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-full md:w-1/2">
                <ServiceCard {...services[2]} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
