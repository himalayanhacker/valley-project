import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-void border-t border-[rgba(56,189,248,0.15)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-sky to-leaf flex items-center justify-center text-void font-bold">UV</div>
              <span className="text-lg font-semibold tracking-wide">Uttarshall Valley</span>
            </div>
            <p className="text-sm text-sub leading-relaxed">
              A pristine Himalayan paradise in Mandi district, Himachal Pradesh — trekking, wildlife, and unforgettable adventures.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-sub">
              <li><Link to="/" className="hover:text-sky transition-colors">Valley Overview</Link></li>
              <li><Link to="/gallery" className="hover:text-sky transition-colors">Photo Gallery</Link></li>
              <li><Link to="/explore" className="hover:text-sky transition-colors">Travel Guides</Link></li>
              <li><Link to="/packages" className="hover:text-sky transition-colors">Packages</Link></li>
              <li><Link to="/contact" className="hover:text-sky transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-sub">
              <li><a href="#" className="hover:text-sky transition-colors">Trail Maps</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Wildlife Guide</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Weather Updates</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Accessibility</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-sub">
              <li><a href="#" className="hover:text-sky transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sky transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="divider mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sub">© {new Date().getFullYear()} Uttarshall Valley Tourism. Mandi, Himachal Pradesh, India.</p>
          <p className="text-xs text-sub">Designed with ♥ for nature lovers</p>
        </div>
      </div>
    </footer>
  )
}
