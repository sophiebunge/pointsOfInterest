'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ExitPage() {
  const router = useRouter()
  const [status, setStatus] = useState('loading')
  const [scans, setScans] = useState([])
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    loadJourney()
  }, [])

  async function loadJourney() {
    const id = localStorage.getItem('session_id')

    if (!id) {
      setStatus('no-session')
      return
    }

    setSessionId(id)

    try {
      // 1. Mark session as ended
      await supabase
        .from('sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', id)

      // 2. Fetch all scans with artwork info
      const { data, error } = await supabase
        .from('scans')
        .select(`
          scanned_at,
          artworks (
            title,
            artist,
            description,
            image_url
          )
        `)
        .eq('session_id', id)
        .order('scanned_at', { ascending: true })

      if (error) throw error

      setScans(data || [])
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function startOver() {
    localStorage.removeItem('session_id')
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <p style={styles.muted}>Building your journey…</p>
        </div>
      </main>
    )
  }

  if (status === 'no-session') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <h2 style={styles.title}>No journey found</h2>
          <p style={styles.muted}>Start a new session to begin.</p>
          <button style={styles.btn} onClick={() => router.push('/')}>Start</button>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <h2 style={styles.title}>Something went wrong</h2>
          <button style={styles.btn} onClick={loadJourney}>Retry</button>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>Your Journey</div>
          <h1 style={styles.title}>
            {scans.length} {scans.length === 1 ? 'work' : 'works'}<br />explored
          </h1>
          <p style={styles.muted}>
            Session {sessionId?.slice(0, 8)}…
          </p>
        </div>

        {/* Visual map — simple node line for now */}
        {scans.length > 0 && (
          <div style={styles.mapContainer}>
            {scans.map((scan, i) => (
              <div key={i} style={styles.nodeRow}>
                <div style={styles.nodeCol}>
                  <div style={styles.node}>
                    <span style={styles.nodeNumber}>{i + 1}</span>
                  </div>
                  {i < scans.length - 1 && <div style={styles.nodeLine} />}
                </div>
                <div style={styles.nodeContent}>
                  <p style={styles.nodeArtist}>{scan.artworks?.artist}</p>
                  <p style={styles.nodeTitle}>{scan.artworks?.title}</p>
                  <p style={styles.nodeTime}>{formatTime(scan.scanned_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {scans.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.muted}>No artworks scanned this session.</p>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.btn} onClick={startOver}>
            Start New Journey
          </button>
        </div>

      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: "'Georgia', serif",
    padding: '2rem',
  },
  container: {
    maxWidth: '420px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    paddingTop: '2rem',
    paddingBottom: '4rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  badge: {
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    color: '#444',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '400',
    color: '#f0ede6',
    margin: 0,
    lineHeight: 1.1,
  },
  muted: {
    fontSize: '0.85rem',
    color: '#444',
    margin: 0,
    fontFamily: 'monospace',
  },
  mapContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '0.5rem',
  },
  nodeRow: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
  },
  nodeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  node: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
    flexShrink: 0,
  },
  nodeNumber: {
    fontSize: '0.7rem',
    color: '#666',
    fontFamily: 'monospace',
  },
  nodeLine: {
    width: '1px',
    height: '2.5rem',
    background: '#1a1a1a',
    margin: '0.25rem 0',
  },
  nodeContent: {
    paddingBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  nodeArtist: {
    fontSize: '0.7rem',
    color: '#444',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: 0,
  },
  nodeTitle: {
    fontSize: '1.1rem',
    color: '#f0ede6',
    fontWeight: '400',
    margin: 0,
  },
  nodeTime: {
    fontSize: '0.75rem',
    color: '#333',
    fontFamily: 'monospace',
    margin: 0,
    marginTop: '0.25rem',
  },
  emptyState: {
    padding: '2rem 0',
    borderTop: '1px solid #111',
    borderBottom: '1px solid #111',
  },
  actions: {
    paddingTop: '1rem',
  },
  btn: {
    background: '#f0ede6',
    color: '#0a0a0a',
    border: 'none',
    padding: '1rem',
    fontSize: '0.9rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
  },
}
