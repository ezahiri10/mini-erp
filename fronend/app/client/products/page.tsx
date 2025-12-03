"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  createdAt: string;
}

export default function ClientProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${apiUrl}/client/products?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data.products);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "insurance":
        return "bg-blue-600";
      case "service":
        return "bg-green-600";
      case "product":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Products & Services</h1>
        <p className="text-gray-400 mt-1">
          Browse available products and services for your account
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center bg-gray-800 rounded-lg p-12 border border-gray-700">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No products available
          </h3>
          <p className="text-gray-400">
            There are no products assigned to your account yet
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-200"
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold text-white ${getTypeColor(
                        product.type
                      )} bg-opacity-20`}
                    >
                      {product.type}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {Math.ceil(total / 10) > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white rounded transition duration-200"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <button
                onClick={() =>
                  setPage(Math.min(Math.ceil(total / 10), page + 1))
                }
                disabled={page === Math.ceil(total / 10)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white rounded transition duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
