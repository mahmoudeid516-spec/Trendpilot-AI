export default function CancelPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">
          <h1 className="text-5xl font-bold text-red-600">
            Payment Cancelled
          </h1>
  
          <p className="mt-6 text-gray-600 text-lg">
            No worries. You can upgrade anytime.
          </p>
  
          <a
            href="/"
            className="mt-8 inline-block bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Back Home
          </a>
        </div>
      </div>
    );
  }