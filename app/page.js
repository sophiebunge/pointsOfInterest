'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function StartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // If session already exists, offer to continue or restart
  const [existingSession, setExistingSession] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('session_id')
    if (id) setExistingSession(id)
  }, [])

  async function startSession() {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ name: 'visitor' }])
        .select()
        .single()

      if (error) throw error

      localStorage.setItem('session_id', data.id)
      router.push('/ready')
    } catch (err) {
      setError('Could not start session. Check your Supabase connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function continueSession() {
    router.push('/ready')
  }

  function clearAndRestart() {
    localStorage.removeItem('session_id')
    setExistingSession(null)
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.badge}>EXHIBITION</div>

        <h1 style={styles.title}>Point of<br />Interest</h1>

        <p style={styles.subtitle}>
          Scan artworks as you move through the space.<br />
          At the end, receive a map of your journey.
        </p>

        {existingSession ? (
          <div style={styles.sessionBox}>
            <p style={styles.sessionNote}>You have an active session.</p>
            <button style={styles.btnPrimary} onClick={continueSession}>
              Continue Journey
            </button>
            <button style={styles.btnGhost} onClick={clearAndRestart}>
              Start Fresh
            </button>
          </div>
        ) : (
          <button
            style={{ ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}
            onClick={startSession}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Begin Journey'}
          </button>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.hint}>
          Hold your phone near an artwork tag to scan
        </div>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Georgia', serif",
    padding: '2rem',
  },
  container: {
    maxWidth: '380px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  badge: {
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    color: '#555',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '400',
    color: '#f0ede6',
    lineHeight: 1.1,
    margin: 0,
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#777',
    lineHeight: 1.7,
    margin: 0,
  },
  btnPrimary: {
    background: '#f0ede6',
    color: '#0a0a0a',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '0.9rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
    transition: 'opacity 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    color: '#555',
    border: '1px solid #222',
    padding: '0.8rem 2rem',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
    marginTop: '0.5rem',
  },
  sessionBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  sessionNote: {
    color: '#555',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  error: {
    color: '#e05555',
    fontSize: '0.85rem',
  },
  hint: {
    fontSize: '0.75rem',
    color: '#333',
    letterSpacing: '0.05em',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #1a1a1a',
  },
}
