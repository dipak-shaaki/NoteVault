import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';

export default function HomePage() {
return (
<main className="min-h-screen bg-white text-gray-800">
{/* Hero Section - already implemented */}
<HeroSection />
{/* Features Section */}
<FeaturesSection />
  {/* CTA Section */}
  <section className="text-center py-20 bg-gradient-to-b from-white to-blue-50 px-4">
    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
    <p className="text-lg mb-6">Create secure, private notes and access them anywhere.</p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Create Account
      </Link>
      <Link href="/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
        Log In
      </Link>
    </div>
  </section>
</main>
);
}