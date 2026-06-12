import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'
import { getArticleImage } from '../api/images'

const CATEGORIES = ['all', 'guides', 'culture', 'trekking', 'wildlife', 'history']

export function ArticleList() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    client.get(`/articles/?${params}`).then(r => {
      setArticles(r.data.results || r.data)
    })
  }, [category, search])

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-pine rounded-full" />
            <span className="text-xs font-medium tracking-widest uppercase text-pine">Content Hub</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Stories & Guides</h1>
          <p className="text-soft max-w-xl">Insider tips, trail guides, and fascinating stories from Uttarshall Valley.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-surface border border-line rounded-lg px-4 py-3 text-sm focus:border-pine focus:outline-none" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border rounded transition-all ${
                  category === cat ? 'border-pine text-pine' : 'border-line text-soft hover:border-pine hover:text-pine'
                }`}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24 text-soft">No articles found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.id} to={`/explore/${article.slug}`}
                className="border border-line rounded-xl overflow-hidden card-hover group block">
                <div className="aspect-video overflow-hidden">
                  <img src={getArticleImage(article.category)} alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <span className="category-tag mb-3 inline-block">{article.category}</span>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-pine transition-colors">{article.title}</h3>
                  <p className="text-sm text-soft mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-soft">
                    <span>{article.author_name}</span>
                    <span>{article.read_time} min read · {article.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    client.get(`/articles/${slug}/`).then(r => setArticle(r.data))
  }, [slug])

  if (!article) return <div className="pt-32 text-center text-soft">Loading...</div>

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/explore" className="text-pine text-sm hover:underline mb-8 block">← Back to all articles</Link>
        <span className="category-tag mb-4 inline-block">{article.category}</span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-soft mb-8">
          <span>By {article.author_name}</span>
          <span>·</span>
          <span>{article.read_time} min read</span>
          <span>·</span>
          <span>{article.views} views</span>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden mb-10">
          <img src={getArticleImage(article.category)} alt={article.title}
            className="w-full h-full object-cover" />
        </div>
        <div className="max-w-none text-soft leading-relaxed space-y-4">
          {article.body.split('\n\n').map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
