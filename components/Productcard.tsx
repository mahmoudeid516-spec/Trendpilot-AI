export default function ProductCard() {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">
        <img
          src="https://picsum.photos/400/250"
          alt="Product"
          className="rounded-xl w-full h-52 object-cover"
        />
  
        <h3 className="text-2xl font-bold mt-5">
          Portable Blender
        </h3>
  
        <p className="text-gray-500 mt-2">
          Perfect for smoothies and protein shakes.
        </p>
  
        <button className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition">
          View Product
        </button>
      </div>
    );
  }