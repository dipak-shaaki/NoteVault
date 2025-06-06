export default function HeroSection() {
return (
<section className="py-20 px-6 md:px-16 bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
<div className="max-w-4xl mx-auto text-center">
<h1 className="text-4xl md:text-6xl font-bold mb-6">
Welcome to NoteVault
</h1>
<p className="text-lg md:text-xl mb-8">
A secure and simple way to store your encrypted notes. Fast. Private. Yours.
</p>
<a href="/register" className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition" >
Get Started
</a>
</div>
</section>
);
}