export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black/50 backdrop-blur-md border-b border-blue-900/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Lazreus Tech
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </nav>
          <div className="flex space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              Login
            </button>
            <button className="border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-900/30 transition-colors">
              Register
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Futuristic Technology Solutions
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Empowering growth and innovation for small and scaling businesses
              through reliable, high-quality technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-md font-medium text-white transition-all duration-300 shadow-lg shadow-blue-900/30">
                Our Services
              </button>
              <button className="border border-gray-700 hover:border-blue-500 px-6 py-3 rounded-md font-medium text-white transition-all duration-300 hover:bg-blue-900/20">
                About Us
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-black/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Web Development",
                  description: "Custom websites and web applications built with modern frameworks and responsive design."
                },
                {
                  title: "App Development",
                  description: "Native and cross-platform mobile applications for iOS and Android platforms."
                },
                {
                  title: "DevOps Services",
                  description: "Streamline your development and operations with our DevOps expertise."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss how we can help your business grow with our technology solutions.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-md font-medium text-white transition-all duration-300 shadow-lg shadow-blue-900/30">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-black/50 border-t border-gray-800/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Lazreus Tech
              </h3>
              <p className="text-gray-400">
                Futuristic technology solutions for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">App Development</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">DevOps Services</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">UX Design</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <p className="text-gray-400">info@lazreustech.com</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Lazreus Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
