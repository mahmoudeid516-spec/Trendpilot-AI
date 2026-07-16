"use client";

import React, { useState } from 'react';

// تعريف شكل البيانات لضمان استقرار الكود
interface ProductProps {
  product: {
    id: number;
    title: string;
    price: string;
    roi: number;
    image: string;
    description: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // يمكنك إضافة منطق التحليل هنا لاحقاً
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border border-gray-100 flex flex-col h-full">
      <img
        src={product.image || "https://picsum.photos/400/250"}
        alt={product.title || "Product Image"}
        className="rounded-xl w-full h-52 object-cover"
      />
      
      <h3 className="text-xl font-bold mt-5 truncate text-slate-900">
        {product.title || "Unnamed Product"}
      </h3>
      
      {/* منطقة البيانات */}
      <div className="flex justify-between mt-4 text-sm bg-slate-50 p-3 rounded-lg">
        <span className="text-slate-600">
          Price: <b className="text-slate-900">${product.price || "0.00"}</b>
        </span>
        <span className="text-green-600 font-bold">
          ROI: {product.roi || 0}%
        </span>
      </div>

      <p className="text-slate-500 mt-4 text-sm line-clamp-2 flex-grow">
        {product.description || "No description available."}
      </p>

      <button 
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
          isAnalyzing 
            ? "bg-slate-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Product"}
      </button>
    </div>
  );
}