import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  link: string;
}

export function ServiceCard({ title, description, link }: ServiceCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={link}
        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
      >
        Khám phá ngay
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
      <div className="mt-4 h-40 bg-blue-100 rounded-lg"></div>
    </div>
  );
}
