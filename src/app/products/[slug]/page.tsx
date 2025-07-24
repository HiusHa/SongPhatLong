"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Star,
  StarHalf,
  X,
  Plus,
  Minus,
  Download,
  FileText,
  Play,
  Eye,
  Upload,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import type { ProductImage, StrapiProduct } from "@/app/types/product";
import { toast, Toaster } from "react-hot-toast";
import { addToCart } from "../../../../utils/cartUtils";
import api from "@/app/_utils/globalApi";
import { getProductUrl } from "../../../../utils/slugtify";

export default function ProductDetailPage() {
  const { slug } = useParams();
  // const router = useRouter();
  const [product, setProduct] = useState<StrapiProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return setIsLoading(false);
      const slugStr = Array.isArray(slug) ? slug[0] : slug;

      try {
        // 1) Lấy toàn bộ list, tìm theo SlugURL
        const resp = await api.getLatestProducts();
        const list: StrapiProduct[] = Array.isArray(resp.data)
          ? resp.data
          : resp.data?.data || [];

        let found = list.find((p) => p.SlugURL === slugStr);

        // 2) Nếu chưa tìm, match slugify(name)
        if (!found) {
          found = list.find((p) => {
            const gen = getProductUrl(p).replace(/^\/products\//, "");
            return gen === slugStr;
          });
        }

        // 3) Nếu vẫn chưa, match mã ID
        if (!found) {
          found = list.find((p) => String(p.id) === slugStr);
        }

        if (found) {
          setProduct(found);
        }
      } catch (e) {
        console.error("Fetch products error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Các hàm còn lại giữ nguyên như trước
  const getProductImages = useCallback(
    (product: StrapiProduct): ProductImage[] => {
      const images: ProductImage[] = [];
      if (product.image) images.push(product.image);
      [product.image2, product.image3, product.image4, product.image5].forEach(
        (imgField) => {
          if (Array.isArray(imgField)) images.push(...imgField.filter(Boolean));
          else if (imgField) images.push(imgField as ProductImage);
        }
      );
      return images;
    },
    []
  );

  const handleImageNavigation = useCallback(
    (direction: "next" | "prev") => {
      if (!product) return;
      const productImages = getProductImages(product);
      setCurrentImageIndex((prev) =>
        direction === "next"
          ? (prev + 1) % productImages.length
          : (prev - 1 + productImages.length) % productImages.length
      );
    },
    [product, getProductImages]
  );

  const handleImageClick = useCallback(() => {
    setIsZoomed((z) => !z);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const renderStars = useCallback(
    (rating: number) => (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          rating >= star ? (
            <Star key={star} className="h-5 w-5 text-yellow-400" />
          ) : rating > star - 1 ? (
            <StarHalf key={star} className="h-5 w-5 text-yellow-400" />
          ) : (
            <Star key={star} className="h-5 w-5 text-gray-300" />
          )
        )}
        <span className="ml-2 text-gray-600 font-medium">
          ({rating.toFixed(1)})
        </span>
      </div>
    ),
    []
  );

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Đang tải xuống...", { duration: 2000 });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <X className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-4 text-2xl font-semibold">
            Không tìm thấy sản phẩm
          </h2>
          <p className="mt-2 text-gray-600">Vui lòng quay lại danh sách.</p>
          <Link href="/products">
            <Button className="mt-4 bg-red-600 text-white">
              Quay về danh sách
            </Button>
          </Link>
        </div>
      </div>
    );

  const productImages = getProductImages(product);
  const productVideo = Array.isArray(product.productVideo)
    ? product.productVideo[0]
    : product.productVideo;
  const documentsArray = product.documents
    ? Array.isArray(product.documents)
      ? product.documents
      : [product.documents]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-3 rounded-xl shadow-sm">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-red-600 transition-colors"
            >
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Debug Info - chỉ hiển thị trong dev mode */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🔧 Debug Info</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Product ID:</strong> {product.id}
              </p>
              <p>
                <strong>Document ID:</strong> {product.documentId}
              </p>
              <p>
                <strong>SlugURL:</strong> {product.SlugURL || "null"}
              </p>
              <p>
                <strong>Current URL Slug:</strong> {slug}
              </p>
              <p>
                <strong>Correct URL:</strong> {getProductUrl(product)}
              </p>
              <p>
                <strong>URL Type:</strong>{" "}
                {product.SlugURL ? "Custom Slug" : "Auto-generated"}
              </p>
            </div>
          </div>
        )}

        {/* Rest of your component JSX remains the same... */}
        {/* I'll keep the existing JSX structure */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Images */}
            <div className="lg:w-1/2 p-8">
              <div
                ref={imageRef}
                className="relative aspect-square cursor-zoom-in rounded-2xl overflow-hidden bg-gray-50 mb-6"
                onClick={handleImageClick}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
              >
                {productImages.length > 0 && (
                  <Image
                    src={
                      productImages[currentImageIndex].url || "/placeholder.svg"
                    }
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("prev");
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("next");
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  </>
                )}

                {showMagnifier && !isZoomed && (
                  <div
                    className="absolute w-40 h-40 border-4 border-white rounded-full overflow-hidden pointer-events-none shadow-xl"
                    style={{
                      backgroundImage: `url(${
                        productImages[currentImageIndex].url ||
                        "/placeholder.svg"
                      })`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "600%",
                      backgroundPosition: `${-zoomPosition.x * 6}px ${
                        -zoomPosition.y * 6
                      }px`,
                      left: `calc(${zoomPosition.x}% - 80px)`,
                      top: `calc(${zoomPosition.y}% - 80px)`,
                    }}
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img.url || "/placeholder.svg"}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-1/2 p-8 lg:border-l border-gray-100">
              {/* Product Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {product.categories?.[0]?.name || "PCCC"}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {product.brand || "N/A"}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    {renderStars(product.rating)}
                  </div>
                )}
                {product.bought && (
                  <div className="text-gray-600">
                    <span className="font-medium">{product.bought}</span> đã bán
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-8">
                {product.originalPrice && (
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-lg text-gray-500 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")}₫
                    </p>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      -
                      {Math.round(
                        ((product.originalPrice - product.pricing) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
                <p className="text-4xl font-bold text-red-600 mb-2">
                  {product.pricing.toLocaleString("vi-VN")}₫
                </p>
                {/* <p className="text-gray-600">Giá đã bao gồm VAT</p> */}
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Thông tin sản phẩm
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã sản phẩm:</span>
                    <span className="font-medium">
                      {product.productID || product.documentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thương hiệu:</span>
                    <span className="font-medium">
                      {product.brand || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Xuất xứ:</span>
                    <span className="font-medium">
                      {product.origin || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 py-2 font-semibold text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-6 py-4 rounded-xl border-2 transition-all ${
                      isFavorite
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-red-300"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-red-300 transition-all bg-transparent"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Contact Button */}
                <Link href="/contact" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Phone className="h-5 w-5 mr-2" />
                    Liên hệ tư vấn
                  </Button>
                </Link>
              </div>

              {/* Service Features */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Miễn phí vận chuyển
                      </div>
                      <div>Đơn hàng từ 5 triệu</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Bảo hành chính hãng
                      </div>
                      <div>Theo quy định nhà sản xuất</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <RotateCcw className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Đổi trả 7 ngày
                      </div>
                      <div>Miễn phí đổi trả</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Liên hệ trực tiếp
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:0905799385"
                    className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">0905799385</div>
                      <div className="text-sm text-gray-500">
                        Hotline bán hàng
                      </div>
                    </div>
                  </a>
                  <a
                    href="mailto:songphatlong@gmail.com"
                    className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">songphatlong@gmail.com</div>
                      <div className="text-sm text-gray-500">Email hỗ trợ</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Video Section */}
        {productVideo && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-red-600" />
              </div>
              Video sản phẩm
            </h2>
            <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden">
              <video
                controls
                className="w-full h-full object-cover"
                poster={productImages[0]?.url || "/placeholder.svg"}
              >
                <source src={productVideo.url} type={productVideo.mime} />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
              <p className="font-medium">{productVideo.name}</p>
              <p>Kích thước: {formatFileSize(productVideo.size)}</p>
            </div>
          </div>
        )}

        {/* Product Documents/Catalog Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            Tài liệu & Catalog
          </h2>

          {documentsArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentsArray.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:border-red-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-7 w-7 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-gray-900 mb-2 line-clamp-2"
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {doc.ext?.toUpperCase()} • {formatFileSize(doc.size)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.url, "_blank")}
                          className="flex items-center gap-2 rounded-xl"
                        >
                          <Eye className="h-4 w-4" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.url, doc.name)}
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 rounded-xl"
                        >
                          <Download className="h-4 w-4" />
                          Tải về
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chưa có tài liệu catalog
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Sản phẩm này chưa có tài liệu kỹ thuật hoặc catalog.
                  <br />
                  Vui lòng liên hệ để được hỗ trợ thêm thông tin chi tiết.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl">
                      <Mail className="h-5 w-5" />
                      Yêu cầu catalog
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 bg-transparent"
                  >
                    <Phone className="h-5 w-5" />
                    Gọi tư vấn: 0905799385
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 text-gray-600 font-medium">
                    Mã sản phẩm
                  </td>
                  <td className="py-4 font-semibold">
                    {product.productID || "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 text-gray-600 font-medium">
                    Thương hiệu
                  </td>
                  <td className="py-4 font-semibold">
                    {product.brand || "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 text-gray-600 font-medium">Xuất xứ</td>
                  <td className="py-4 font-semibold">
                    {product.origin || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
          <div className="prose prose-lg max-w-none">
            {product.description && product.description.length > 0 ? (
              <div className="space-y-4">
                {product.description.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph.children &&
                      paragraph.children.map((child, childIndex) => {
                        let className = "";
                        if (child.bold) className += "font-bold ";
                        if (child.underline) className += "underline ";
                        if (child.italic) className += "italic ";

                        return (
                          <span key={childIndex} className={className.trim()}>
                            {child.text}
                          </span>
                        );
                      })}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  Chưa có mô tả chi tiết cho sản phẩm này
                </p>
                <p className="text-sm mt-2">
                  Vui lòng liên hệ để biết thêm thông tin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Zoomed Image */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={handleImageClick}
        >
          <div className="relative w-full h-full">
            <Image
              src={productImages[currentImageIndex].url || "/placeholder.svg"}
              alt={`${product.name} - Zoomed Image`}
              fill
              className="object-contain"
              unoptimized
            />
            <button
              className="absolute top-6 right-6 text-white z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
