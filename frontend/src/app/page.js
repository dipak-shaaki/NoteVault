import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeatureSection';

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

{/* Footer Section */ }

<footer className="bg-gray-100 text-center text-sm text-gray-600 py-6 border-t mt-10"> <div className="container mx-auto px-4"> <p>&copy; {new Date().getFullYear()} NoteVault. All rights reserved.</p> <div className="mt-2 flex justify-center gap-4 text-sm"> <a href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</a> <a href="/terms" className="hover:text-blue-600 transition">Terms of Service</a> </div> </div> </footer>
