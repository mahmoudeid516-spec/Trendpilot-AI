"use client";

import { useState } from "react";
import { deleteProduct } from "../../lib/services/deleteProduct";

type Props = {
  id: string;
};

export default function DeleteButton({
  id,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!ok) return;

    try {
      setLoading(true);

      await deleteProduct(id);

      location.reload();

    } catch (err) {
      console.error(err);

      alert("Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
    >
      {loading ? "Deleting..." : "🗑 Delete"}
    </button>
  );
}