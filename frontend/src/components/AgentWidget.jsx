import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function AgentWidget() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const ask = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const { data } = await client.post('/agent/ask/', { question })
      setResult(data)
    } catch {
      setResult({ answer: 'Sorry, I could not process your question right now. Please try again.', sources: [] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-primary shadow-lg text-2xl"
        title="Ask about Uttarshall Valley"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-panel border border-[rgba(56,189,248,0.3)] rounded-xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(56,189,248,0.15)]">
            <h3 className="font-semibold text-sm">Valley Guide AI</h3>
            <p className="text-xs text-sub mt-1">Ask me anything about Uttarshall Valley, Mandi, HP</p>
          </div>

          <div className="p-4 min-h-[120px]">
            {loading && (
              <div className="flex items-center gap-2 text-sub text-sm">
                <span className="animate-pulse">●</span>
                Searching valley knowledge base...
              </div>
            )}
            {result && (
              <div>
                <p className="text-sm leading-relaxed mb-4">{result.answer}</p>
                {result.sources?.length > 0 && (
                  <div>
                    <p className="text-xs text-sub uppercase tracking-wide mb-2">Sources</p>
                    <div className="flex flex-col gap-1">
                      {result.sources.map((s, i) => (
                        <Link key={i} to={`/explore/${s.slug}`} className="text-xs text-sky hover:underline" onClick={() => setOpen(false)}>
                          → {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!loading && !result && (
              <p className="text-xs text-sub">Try: "What is Prashar Lake?" or "Best time to visit for trekking?"</p>
            )}
          </div>

          <form onSubmit={ask} className="p-4 border-t border-[rgba(56,189,248,0.15)] flex gap-2">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 bg-void border border-[rgba(56,189,248,0.15)] rounded px-3 py-2 text-sm focus:border-sky focus:outline-none"
            />
            <button type="submit" disabled={loading} className="btn-primary px-4 py-2 text-xs rounded disabled:opacity-50">
              Ask
            </button>
          </form>
        </div>
      )}
    </>
  )
}
