export function Banner() {
  return (
    <div className="w-full space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=800&text=Thiết+Bị+Chữa+Cháy"
            alt="Thiết bị chữa cháy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">
              Thiết Bị Chữa Cháy
            </h2>
          </div>
        </div>
        <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=800&text=Thiết+Bị+Cứu+Hộ"
            alt="Thiết bị cứu hộ"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">Thiết Bị Cứu Hộ</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
