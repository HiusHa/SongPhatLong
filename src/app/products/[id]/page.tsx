"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import type { ProductImage, StrapiProduct } from "@/app/types/product";
import { toast, Toaster } from "react-hot-toast";
import { addToCart } from "../../../../utils/cartUtils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<StrapiProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://songphatlong-admin.onrender.com/api/products/${id}?populate=*`
        );
        const data = await response.json();
        setProduct(data.data);
        console.log("Product data:", data.data); // Debug log
        console.log("Product documents:", data.data?.documents); // Debug documents
        console.log("Product video:", data.data?.productVideo); // Debug video
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageNavigation = useCallback(
    (direction: "next" | "prev") => {
      if (!product) return;
      const productImages = getProductImages(product);
      setCurrentImageIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % productImages.length;
        } else {
          return (prevIndex - 1 + productImages.length) % productImages.length;
        }
      });
    },
    [product]
  );

  const handleImageClick = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = ((event.clientX - left) / width) * 100;
      const y = ((event.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return (
              <Star
                key={star}
                className="h-5 w-5 text-yellow-400 fill-yellow-400"
              />
            );
          } else if (rating > star - 1) {
            return (
              <StarHalf
                key={star}
                className="h-5 w-5 text-yellow-400 fill-yellow-400"
              />
            );
          } else {
            return <Star key={star} className="h-5 w-5 text-gray-300" />;
          }
        })}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  }, []);

  const getProductImages = useCallback(
    (product: StrapiProduct): ProductImage[] => {
      const images: ProductImage[] = [];
      if (product.image) images.push(product.image);
      if (product.image2) {
        if (Array.isArray(product.image2)) {
          product.image2.forEach((img) => {
            if (img) images.push(img);
          });
        } else {
          images.push(product.image2);
        }
      }
      if (product.image3) {
        if (Array.isArray(product.image3)) {
          product.image3.forEach((img) => {
            if (img) images.push(img);
          });
        } else {
          images.push(product.image3);
        }
      }
      if (product.image4) {
        if (Array.isArray(product.image4)) {
          product.image4.forEach((img) => {
            if (img) images.push(img);
          });
        } else {
          images.push(product.image4);
        }
      }
      if (product.image5) {
        if (Array.isArray(product.image5)) {
          product.image5.forEach((img) => {
            if (img) images.push(img);
          });
        } else {
          images.push(product.image5);
        }
      }
      return images.filter((img): img is ProductImage => img !== null);
    },
    []
  );

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(
        `Đã thêm ${quantity} ${
          quantity > 1 ? "sản phẩm" : "sản phẩm"
        } vào giỏ hàng`,
        {
          duration: 3000,
          position: "top-center",
        }
      );
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đang tải xuống...", { duration: 2000 });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const productImages = getProductImages(product);

  // Handle productVideo - could be single object, array, or null
  const productVideo = product.productVideo
    ? Array.isArray(product.productVideo)
      ? product.productVideo[0]
      : product.productVideo
    : null;

  // Handle documents - could be single object, array, or null
  const documentsArray = product.documents
    ? Array.isArray(product.documents)
      ? product.documents
      : [product.documents]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-sm">
          {/* Left Column - Images */}
          <div className="md:w-1/2">
            <div
              ref={imageRef}
              className="relative aspect-square cursor-zoom-in flex items-start justify-center"
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
                  className="object-fill object-top rounded-lg"
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation("next");
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}
              {showMagnifier && !isZoomed && (
                <div
                  className="absolute w-40 h-40 border-2 border-gray-300 rounded-full overflow-hidden pointer-events-none"
                  style={{
                    backgroundImage: `url(${
                      productImages[currentImageIndex].url || "/placeholder.svg"
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

            {productImages.length > 1 && (
              <div className="flex mt-4 gap-4 overflow-x-auto">
                {productImages.map((img, index) => (
                  <Image
                    key={index}
                    src={img.url || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className={`object-cover rounded cursor-pointer ${
                      index === currentImageIndex
                        ? "border-2 border-red-600"
                        : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              {product.name}
            </h1>

            {/* Rating and Bought Count */}
            <div className="flex items-center gap-4 mb-4">
              {product.rating && renderStars(product.rating)}
              {product.bought && (
                <div className="text-gray-600">Đã bán: {product.bought}</div>
              )}
            </div>

            {/* Product Details Table */}
            <div className="mb-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Mã sản phẩm:</td>
                    <td className="py-2">
                      {product.productID || product.documentId}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Thương hiệu:</td>
                    <td className="py-2">{product.brand || "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Xuất xứ:</td>
                    <td className="py-2">{product.origin || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-base text-gray-500 line-through">
                {(product.pricing * 1.2).toLocaleString("vi-VN")}₫
              </p>
              {product.originalPrice && (
                <p className="text-gray-500 line-through text-lg">
                  {product.originalPrice.toLocaleString("vi-VN")}₫
                </p>
              )}
              <p className="text-3xl font-bold text-red-600">
                {product.pricing.toLocaleString("vi-VN")}₫
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg mb-4"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>

            {/* Contact Button */}
            <Link href="/contact" className="block mb-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                Liên hệ
              </Button>
            </Link>

            {/* Contact Information */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                <a
                  href="tel:0905799385"
                  className="text-gray-700 hover:text-red-600"
                >
                  0905799385
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-600" />
                <a
                  href="mailto:songphatlong@gmail.com"
                  className="text-gray-700 hover:text-red-600"
                >
                  songphatlong@gmail.com
                </a>
              </div>
            </div>

            {/* Social Sharing */}
            <div>
              <p className="text-gray-600 mb-2">Chia sẻ lên:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-blue-600 bg-transparent"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-blue-400 bg-transparent"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-blue-700 bg-transparent"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Video Section */}
        {productVideo && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Play className="h-6 w-6 text-red-600" />
              Video sản phẩm
            </h2>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full object-cover"
                poster={productImages[0]?.url || "/placeholder.svg"}
              >
                <source src={productVideo.url} type={productVideo.mime} />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>{productVideo.name}</p>
              <p>Kích thước: {formatFileSize(productVideo.size)}</p>
            </div>
          </div>
        )}

        {/* Product Documents/Catalog Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-red-600" />
            Tài liệu & Catalog
          </h2>

          {documentsArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentsArray.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-medium text-gray-900 truncate"
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {doc.ext?.toUpperCase()} • {formatFileSize(doc.size)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.url, "_blank")}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.url, doc.name)}
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
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
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chưa có tài liệu catalog
                </h3>
                <p className="text-gray-600 mb-6">
                  Sản phẩm này chưa có tài liệu kỹ thuật hoặc catalog.
                  <br />
                  Vui lòng liên hệ để được hỗ trợ thêm thông tin chi tiết.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Yêu cầu catalog
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Phone className="h-4 w-4" />
                    Gọi tư vấn: 0905799385
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications Table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Mã sản phẩm:</td>
                <td className="py-2">{product.productID || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Thương hiệu:</td>
                <td className="py-2">{product.brand || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Xuất xứ:</td>
                <td className="py-2">{product.origin || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Mô tả</h2>
          <div className="prose max-w-none">
            {product.description && product.description.length > 0 ? (
              <div className="space-y-2">
                {product.description.map((paragraph, index) => (
                  <p key={index} className="text-gray-700">
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
              <p className="text-gray-600">No description available</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Zoomed Image */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
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
              className="absolute top-4 right-4 text-white z-10"
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
