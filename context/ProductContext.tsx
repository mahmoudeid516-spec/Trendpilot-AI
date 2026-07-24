"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ProductContextType = {
  products: any[];
  setProducts: (products: any[]) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export function ProductProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<any[]>([]);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return context;
}