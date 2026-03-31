'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReadyPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('session_id')
    if (!id) {
      router.push('/')
      return
    }
    setSessionId(id)
  }, [])

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.dot} />

        <h2 style={styles.title}>Journey Started</h2>

        <p style={styles.body}>
          Walk through the exhibition and hold your phone near each artwork you want to remember.
        </p>

        <p style={styles.body}>
          When you're done, find the <strong style={{ color: '#f0ede6' }}>EXIT</strong> tag to receive your personal map.
        </p>

        {sessionId && (
          <div style={styles.idBox}>
            <span style={styles.idLabel}>Session</span>
            <span style={styles.idValue}>{sessionId.slice(0, 8)}…</span>
          </div>
        )}
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
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#4caf72',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '400',
    color: '#f0ede6',
    margin: 0,
  },
  body: {
    fontSize: '0.95rem',
    color: '#777',
    lineHeight: 1.7,
    margin: 0,
  },
  idBox: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #1a1a1a',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    color: '#333',
    textTransform: 'uppercase',
  },
  idValue: {
    fontSize: '0.8rem',
    color: '#444',
    fontFamily: 'monospace',
  },
}
