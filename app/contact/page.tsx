export default function ContactPage() {
    return (
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-12">
  
          <h1 className="text-5xl font-bold text-purple-700">
            Contact Us
          </h1>
  
          <p className="mt-8 text-gray-700">
            We'd love to hear from you.
          </p>
  
          <div className="mt-10 space-y-5">
  
            <div>
              <strong>Email</strong>
              <p>support@trendpilotai.com</p>
            </div>
  
            <div>
              <strong>Business</strong>
              <p>TrendPilot AI</p>
            </div>
  
            <div>
              <strong>Support</strong>
              <p>Monday - Friday</p>
            </div>
  
          </div>
  
        </div>
      </main>
    );
  }