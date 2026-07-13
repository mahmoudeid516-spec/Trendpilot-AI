"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-600"
      />

    </div>
  );
}