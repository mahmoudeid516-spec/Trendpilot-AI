export default function PrivacyPage() {
    return (
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12">
  
          <h1 className="text-5xl font-bold text-purple-700">
            Privacy Policy
          </h1>
  
          <p className="mt-8 text-gray-700 leading-8">
            TrendPilot AI respects your privacy and is committed to protecting your personal information.
          </p>
  
          <h2 className="mt-10 text-2xl font-bold">
            Information We Collect
          </h2>
  
          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
            <li>Name and email address</li>
            <li>Account information</li>
            <li>Subscription details</li>
            <li>Product searches and analytics usage</li>
          </ul>
  
          <h2 className="mt-10 text-2xl font-bold">
            How We Use Your Information
          </h2>
  
          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
            <li>Improve our AI services</li>
            <li>Provide customer support</li>
            <li>Manage subscriptions</li>
            <li>Enhance product recommendations</li>
          </ul>
  
        </div>
      </main>
    );
  }