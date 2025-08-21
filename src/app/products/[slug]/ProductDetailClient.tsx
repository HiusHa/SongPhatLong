// app/products/[slug]/ProductDetailClient.tsx
"use client";
import { JSX } from "react";
import type React from "react";
import { useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Toaster, toast } from "react-hot-toast";
import { addToCart } from "../../../../utils/cartUtils";
import { getProductUrl } from "../../../../utils/slugtify";

// ---- Minimal types UI cần ----
export type ProductImage = {
  url?: string;
  name?: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
  caption?: string | null;
  size?: number;
  mime?: string;
};

type MediaFile = {
  url: string;
  name?: string;
  size?: number;
  mime?: string;
};

export type ClientProduct = {
  id?: string | number;
  documentId?: string;
  name: string;
  SlugURL?: string | null;

  pricing?: number; // đã ép số ở server
  originalPrice?: number; // đã ép số ở server
  rating?: number; // đã ép số ở server

  image?: ProductImage | null;
  image2?: ProductImage | ProductImage[] | null;
  image3?: ProductImage | ProductImage[] | null;
  image4?: ProductImage | ProductImage[] | null;
  image5?: ProductImage | ProductImage[] | null;

  productVideo?: MediaFile | MediaFile[] | null;
  documents?: MediaFile | MediaFile[] | null;

  categories?: { name?: string | null }[] | null;
  brand?: string | null;
  origin?: string | null;
  bought?: number | null;

  description?: any;
};

// ---- Helpers ----

const toCurrency = (v: number) => `${v.toLocaleString("vi-VN")}₫`;
const fileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
const asArray = <T,>(x: T | T[] | null | undefined): T[] =>
  Array.isArray(x) ? x.filter(Boolean) : x ? [x] : [];

// ---- Rich Text renderer (giữ nguyên) ----
const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content || !Array.isArray(content)) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null;

    if (node.type === "text") {
      let text: React.ReactNode = node.text || "";
      if (node.bold) text = <strong key={index}>{text}</strong>;
      if (node.italic) text = <em key={index}>{text}</em>;
      if (node.underline) text = <u key={index}>{text}</u>;
      if (node.strikethrough) text = <s key={index}>{text}</s>;
      if (node.code) {
        text = (
          <code
            key={index}
            className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm"
          >
            {text}
          </code>
        );
      }
      return text;
    }

    switch (node.type) {
      case "paragraph":
        return (
          <div key={index} className="text-gray-700 leading-relaxed mb-4">
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </div>
        );

      case "heading": {
        const HeadingTag = `h${node.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClass =
          node.level === 1
            ? "text-3xl font-bold mb-4 mt-6"
            : node.level === 2
            ? "text-2xl font-bold mb-3 mt-5"
            : node.level === 3
            ? "text-xl font-bold mb-2 mt-4"
            : node.level === 4
            ? "text-lg font-bold mb-2 mt-3"
            : "text-md font-bold mb-2 mt-3";

        const children = (node.children || []).map((child: any, i: number) => {
          if (child.type === "text") {
            let text: React.ReactNode = child.text || "";
            if (child.bold) text = <strong key={i}>{text}</strong>;
            if (child.italic) text = <em key={i}>{text}</em>;
            if (child.underline) text = <u key={i}>{text}</u>;
            if (child.strikethrough) text = <s key={i}>{text}</s>;
            if (child.code) {
              text = (
                <code
                  key={i}
                  className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm"
                >
                  {text}
                </code>
              );
            }
            return text;
          }
          return child?.text || "";
        });

        const Tag = HeadingTag as React.ElementType;
        return (
          <Tag key={index} className={headingClass}>
            {children}
          </Tag>
        );
      }

      case "list": {
        const ListTag = (node.format === "ordered" ? "ol" : "ul") as
          | "ol"
          | "ul";
        const listClass =
          node.format === "ordered"
            ? "list-decimal pl-6 mb-4 space-y-2"
            : "list-disc pl-6 mb-4 space-y-2";
        return (
          <ListTag key={index} className={listClass}>
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </ListTag>
        );
      }

      case "list-item":
        return (
          <li key={index} className="text-gray-700">
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </li>
        );

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-red-500 pl-4 italic text-gray-600 my-4"
          >
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </blockquote>
        );

      case "code":
        return (
          <pre
            key={index}
            className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
          >
            <code>
              {node.children?.map((child: any, i: number) =>
                renderNode(child, i)
              )}
            </code>
          </pre>
        );

      case "link":
        return (
          <a
            key={index}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline"
          >
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </a>
        );

      case "image":
        return (
          <div key={index} className="my-6">
            <Image
              src={node.image?.url || "/placeholder.svg"}
              alt={node.image?.alt || ""}
              width={1200}
              height={800}
              className="rounded-xl shadow-md w-full h-auto"
              unoptimized
            />
            {node.image?.caption && (
              <p className="text-center text-gray-500 text-sm mt-2">
                {node.image.caption}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={index} className="mb-4">
            {node.children?.map((child: any, i: number) =>
              renderNode(child, i)
            )}
          </div>
        );
    }
  };

  return <div className="space-y-4">{content.map(renderNode)}</div>;
};

// ---- Main component ----
export default function ProductDetailClient({
  product,
}: {
  product: ClientProduct;
}) {
  // Derived values
  const price = product.pricing;
  const original = product.originalPrice;
  const rating = product.rating;
  const discountPct =
    typeof price === "number" &&
    typeof original === "number" &&
    original > price
      ? Math.round(((original - price) / original) * 100)
      : null;

  const images: ProductImage[] = useMemo(() => {
    const out: ProductImage[] = [];
    const push = (x: any) => {
      if (!x) return;
      if (Array.isArray(x)) x.forEach(push);
      else if (x.url) out.push({ ...x, url: x.url });
    };
    push(product.image);
    push(product.image2);
    push(product.image3);
    push(product.image4);
    push(product.image5);
    return out.length
      ? out
      : [{ url: "/placeholder.svg", name: "placeholder" }];
  }, [product]);

  const productVideo = useMemo(
    () => asArray<MediaFile>(product.productVideo)[0],
    [product]
  );
  const documents = useMemo(
    () => asArray<MediaFile>(product.documents),
    [product]
  );

  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handlers
  const navImage = useCallback(
    (dir: "next" | "prev") => {
      setCurrentImageIndex((prev) =>
        dir === "next"
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    },
    [images.length]
  );

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const renderStars = (r?: number) => {
    if (typeof r !== "number") return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) =>
          r >= s ? (
            <Star key={s} className="h-5 w-5 text-yellow-400" />
          ) : r > s - 1 ? (
            <StarHalf key={s} className="h-5 w-5 text-yellow-400" />
          ) : (
            <Star key={s} className="h-5 w-5 text-gray-300" />
          )
        )}
        <span className="ml-2 text-gray-600 font-medium">({r.toFixed(1)})</span>
      </div>
    );
  };

  const handleAddToCart = () => {
    addToCart(product as any, quantity); // util của bạn; product có đủ id/name/price/image
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, {
      duration: 3000,
      position: "top-center",
    });
  };

  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Đang tải xuống...", { duration: 2000 });
  };

  // ---- UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />

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

      {/* Debug (chỉ dev) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🔧 Debug Info</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>ID:</strong> {String(product.id ?? "")}
            </p>
            <p>
              <strong>SlugURL:</strong> {product.SlugURL || "null"}
            </p>
            <p>
              <strong>Correct URL:</strong> {getProductUrl(product as any)}
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Images */}
          <div className="lg:w-1/2 p-8">
            <div
              ref={imageRef}
              className="relative aspect-square cursor-zoom-in rounded-2xl overflow-hidden bg-gray-50 mb-6"
              onClick={() => setIsZoomed((z) => !z)}
              onMouseMove={onMouseMove}
              onMouseEnter={() => setShowMagnifier(true)}
              onMouseLeave={() => setShowMagnifier(false)}
            >
              <Image
                src={images[currentImageIndex]?.url || "/placeholder.svg"}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navImage("prev");
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navImage("next");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}

              {showMagnifier && !isZoomed && images[currentImageIndex] && (
                <div
                  className="absolute w-40 h-40 border-4 border-white rounded-full overflow-hidden pointer-events-none shadow-xl"
                  style={{
                    backgroundImage: `url(${
                      images[currentImageIndex].url || "/placeholder.svg"
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

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === currentImageIndex
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:w-1/2 p-8 lg:border-l border-gray-100">
            {/* Title */}
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

            {/* Rating / Stats */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
              {renderStars(rating)}
              {typeof product.bought === "number" && (
                <div className="text-gray-600">
                  <span className="font-medium">{product.bought}</span> đã bán
                </div>
              )}
            </div>


              
            {/* Price */}
            <div className="mb-8">
              {typeof original === "number" &&
                typeof price === "number" &&
                original > price && (
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-lg text-gray-500 line-through">
                      {toCurrency(original)}
                    </p>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      -{discountPct}%
                    </span>
                  </div>
                )}

              <p className="text-4xl font-bold text-red-600 mb-2">
                {typeof price === "number" ? toCurrency(price) : "Liên hệ"}
              </p>
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thông tin sản phẩm
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="font-medium">
                    {(product as any).productID || product.documentId || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="font-medium">{product.brand || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-medium">{product.origin || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Qty + Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
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
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Đã sao chép liên kết!");
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Link href="/contact" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Phone className="h-5 w-5 mr-2" />
                  Liên hệ tư vấn
                </Button>
              </Link>
            </div>

            {/* Services */}
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
          </div>
        </div>
      </div>

      {/* Video */}
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
              poster={images[0]?.url || "/placeholder.svg"}
            >
              <source
                src={productVideo.url}
                type={productVideo.mime || "video/mp4"}
              />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
            <p className="font-medium">{productVideo.name || "Video"}</p>
            <p>Kích thước: {fileSize(productVideo.size)}</p>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          Tài liệu &amp; Catalog
        </h2>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:border-red-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-7 w-7 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-gray-900 mb-2 line-clamp-2"
                      title={doc.name || "Document"}
                    >
                      {doc.name || "Document"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {(doc.mime || "").toUpperCase() || "FILE"} •{" "}
                      {fileSize(doc.size)}
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
                        onClick={() =>
                          download(doc.url, doc.name || "document")
                        }
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

      {/* Technical Specs */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-4 text-gray-600 font-medium">Mã sản phẩm</td>
                <td className="py-4 font-semibold">
                  {(product as any).productID || "N/A"}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 text-gray-600 font-medium">Thương hiệu</td>
                <td className="py-4 font-semibold">{product.brand || "N/A"}</td>
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

      {/* Description */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
        <div className="prose prose-lg max-w-none">
          {product.description ? (
            <RichTextRenderer content={product.description} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chưa có mô tả chi tiết cho sản phẩm này</p>
              <p className="text-sm mt-2">
                Vui lòng liên hệ để biết thêm thông tin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Zoom */}
      {isZoomed && images[currentImageIndex] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex].url || "/placeholder.svg"}
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
