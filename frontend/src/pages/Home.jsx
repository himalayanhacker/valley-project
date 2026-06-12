import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { IMAGES, getArticleImage, getPackageImage } from '../api/images'

const STATS = [
  { value: '4,200m', label: 'Peak Elevation (Shikari Devi)' },
  { value: '1,200 km²', label: 'Valley Spread' },
  { value: '32', label: 'Trekking Routes' },
  { value: '180+', label: 'Wildlife Species' },
]

export default function Home() {
  const [packages, setPackages] = useState([])
  const [articles, setArticles] = useState([])

  useEffect(() => {
    client.get('/packages/').then(r => setPackages(r.data.slice(0, 3)))
    client.get('/articles/').then(r => setArticles(r.data.results?.slice(0, 3) || r.data.slice(0, 3)))
  }, [])

  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-end pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Prashar Lake, Uttarshall Valley"
            className="w-full h-full object-cover grayscale contrast-125 opacity-60" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #010409, rgba(1,4,9,0.6), transparent)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.08), transparent 70%)' }} />
        </div>
        <div className="scan-line" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-xs font-medium tracking-widest uppercase text-pine mb-6">
            Mandi District · Himachal Pradesh · India
          </p>
          <h1 className="text-4xl md:text-7xl font-semibold tracking-tightest leading-none mb-6">
            <span className="block text-white">UTTARSHALL</span>
            <span className="block bg-gradient-to-r from-pine to-moss bg-clip-text text-transparent">VALLEY</span>
          </h1>
          <p className="text-soft text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            A pristine Himalayan paradise where snow leopards roam ancient forests, sacred lakes mirror towering peaks, and every trail leads to breathtaking discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="btn-primary px-10 py-4 text-sm rounded" style={{ boxShadow: '0 0 15px rgba(56,189,248,0.3)' }}>
              Plan Your Visit
            </Link>
            <Link to="/explore" className="btn-secondary px-10 py-4 text-sm rounded flex items-center justify-center gap-2">
              Explore Guides
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-soft">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <span className="text-xl animate-bounce">↓</span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface border-y border-line py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-semibold mb-1" style={{ background: 'linear-gradient(to right, #fff, #38bdf8, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </p>
              <p className="text-xs text-soft uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-pine rounded-full" />
              <span className="text-xs font-medium tracking-widest uppercase text-pine">Overview</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">A Himalayan Wonder</h2>
            <div className="divider w-24 mb-6" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-6">Where Himalayas Meet the Sky</h3>
              <div className="space-y-4 text-soft leading-relaxed">
                <p>Nestled in the heart of Mandi district, Himachal Pradesh, Uttarshall Valley spans over 1,200 square kilometres of pristine Himalayan wilderness. The valley's unique geography creates diverse ecosystems — from subtropical forests along the Beas river to alpine meadows and glaciated peaks above 4,000 metres.</p>
                <p>Home to the elusive snow leopard, Himalayan brown bear, and the vibrant monal pheasant (Himachal Pradesh's state bird), the valley is a sanctuary for wildlife. Ancient deodar cedar forests cover the mid-elevation slopes, while rhododendron and oak forests burst into colour each spring.</p>
                <p>The valley is deeply intertwined with the cultural fabric of Mandi district — famous for its 81 ancient stone temples, the Shivratri festival of gods, and the indigenous Gaddi pastoral communities who have inhabited these mountains for centuries.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: '☀️', title: 'Best Seasons', desc: 'May – Oct (trekking), Dec – Mar (snow)' },
                  { icon: '🚗', title: 'Accessibility', desc: '5hr from Delhi, 2hr from Chandigarh' },
                  { icon: '✈️', title: 'Nearest Airport', desc: 'Bhuntar (Kullu), ~70 km' },
                  { icon: '🛡️', title: 'Conservation', desc: 'Shikari Devi Wildlife Sanctuary' },
                ].map((f, i) => (
                  <div key={i} className="p-4 border border-line rounded-lg card-hover">
                    <span className="text-2xl mb-2 block">{f.icon}</span>
                    <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                    <p className="text-xs text-soft">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
                  <img src={IMAGES.prasharLake} alt="Prashar Lake"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, #010409, transparent)' }}>
                    <p className="text-xs font-medium">Prashar Lake</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <img src={IMAGES.uhlRiver} alt="Uhl River, Barot"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, #010409, transparent)' }}>
                    <p className="text-xs font-medium">Uhl River, Barot</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <img src={IMAGES.himachalForest} alt="Deodar Forest"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, #010409, transparent)' }}>
                    <p className="text-xs font-medium">Deodar Forests</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
                  <img src={IMAGES.panchvaktraTemple} alt="Panchvaktra Temple, Mandi"
                    className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, #010409, transparent)' }}>
                    <p className="text-xs font-medium">Panchvaktra Temple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages preview */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-pine rounded-full" />
                <span className="text-xs font-medium tracking-widest uppercase text-pine">Packages</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Travel Packages</h2>
            </div>
            <Link to="/packages" className="btn-secondary px-6 py-3 text-xs font-semibold uppercase tracking-wide rounded">
              View All Packages
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div key={pkg.id} className={`border ${pkg.featured ? 'border-pine' : 'border-line'} rounded-xl overflow-hidden card-hover relative`}>
                {pkg.featured && <div className="absolute top-4 right-4 bg-pine text-on-accent text-xs font-semibold px-3 py-1 rounded z-10">Most Popular</div>}
                <div className="aspect-video overflow-hidden">
                  <img src={getPackageImage(i)} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                  <p className="text-sm text-soft mb-4">{pkg.duration_days} Days / {pkg.duration_days - 1} Nights</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.highlights?.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-soft">
                        <span className="text-pine">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-line">
                    <div>
                      <span className="text-2xl font-semibold text-pine">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                      <span className="text-xs text-soft"> / person</span>
                    </div>
                    <Link to="/packages" className="btn-primary px-6 py-2 text-xs rounded">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles preview */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-pine rounded-full" />
                <span className="text-xs font-medium tracking-widest uppercase text-pine">Stories & Guides</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Explore the Valley</h2>
            </div>
            <Link to="/explore" className="btn-secondary px-6 py-3 text-xs font-semibold uppercase tracking-wide rounded">
              All Articles
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.id} to={`/explore/${article.slug}`}
                className="border border-line rounded-xl overflow-hidden card-hover group cursor-pointer block">
                <div className="aspect-video overflow-hidden">
                  <img src={getArticleImage(article.category)} alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <span className="category-tag mb-3 inline-block">{article.category}</span>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-pine transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-soft line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-soft">
                    <span>{article.author_name}</span>
                    <span>·</span>
                    <span>{article.read_time} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Photo credit */}
      <div className="text-center py-4 text-xs text-soft/50 bg-canvas border-t border-line">
        Photos: Wikimedia Commons (CC BY-SA 4.0) · Unsplash (free to use)
      </div>
    </div>
  )
}
