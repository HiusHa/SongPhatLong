export function SectionError({ section }: { section: string }) {
  return (
    <div className="p-4 my-4 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-center text-gray-500">
        Unable to load {section} section. Please refresh the page.
      </p>
    </div>
  );
}
