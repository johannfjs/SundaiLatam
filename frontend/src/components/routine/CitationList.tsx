import type { Citation } from '../../types'

interface CitationListProps {
  citations: Citation[]
}

export function CitationList({ citations }: CitationListProps) {
  if (citations.length === 0) return null

  const unique = citations.filter(
    (c, i, arr) => arr.findIndex((x) => x.title === c.title) === i,
  )

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        References ({unique.length})
      </h4>
      <ol className="space-y-2">
        {unique.map((c, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gray-600 text-xs font-mono shrink-0 mt-0.5">[{i + 1}]</span>
            <div className="text-xs text-gray-400 leading-relaxed">
              <span className="text-gray-300">{c.authors.join(', ')}</span>
              {' '}({c.year}).{' '}
              {c.doi ? (
                <a
                  href={`https://doi.org/${c.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  {c.title}
                </a>
              ) : (
                <span className="italic">{c.title}</span>
              )}
              {c.journal && <span className="text-gray-500">. {c.journal}.</span>}
              {c.doi && <span className="text-gray-600 ml-1 text-xs">DOI: {c.doi}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
