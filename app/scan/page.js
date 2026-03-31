'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

function ScanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const nfcCode = searchParams.get('artwork') // e.g. /scan?artwork=artwork-01

  const [status, setStatus] = useState('loading') // loading | scanning | success | error | no-session
  const [artwork, setArtwork] = useState(null)
  const [alreadyScanned, setAlreadyScanned] = useState(false)

  useEffect(() => {
    if (!nfcCode) {
      setStatus('error')
      return
    }
    handleScan()
  }, [nfcCode])

  async function handleScan() {
    const sessionId = localStorage.getItem('session_id')

    if (!sessionId) {
      setStatus('no-session')
      return
    }

    setStatus('scanning')

    try {
      // 1. Find artwork by nfc_code
      const { data: artworkData, error: artworkError } = await supabase
        .from('artworks')
        .select('*')
        .eq('nfc_code', nfcCode)
        .single()

      if (artworkError || !artworkData) {
        setStatus('error')
        return
      }

      setArtwork(artworkData)

      // 2. Check if already scanned in this session
      const { data: existingScan } = await supabase
        .from('scans')
        .select('id')
        .eq('session_id', sessionId)
        .eq('artwork_id', artworkData.id)
        .single()

      if (existingScan) {
        setAlreadyScanned(true)
        setStatus('success')
        return
      }

      // 3. Log the scan
      const { error: scanError } = await supabase
        .from('scans')
        .insert([{
          session_id: sessionId,
          artwork_id: artworkData.id,
        }])

      if (scanError) throw scanError

      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'no-session') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <p style={styles.label}>No active session</p>
          <h2 style={styles.title}>Start first</h2>
          <p style={styles.body}>You need to begin your journey before scanning artworks.</p>
          <button style={styles.btn} onClick={() => router.push('/')}>
            Go to Start
          </button>
        </div>
      </main>
    )
  }

  if (status === 'loading' || status === 'scanning') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.spinner} />
          <p style={styles.body}>Scanning artwork…</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main style={styles.main}>
        <div style={styles.container}>
          <p style={styles.label}>Error</p>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.body}>This artwork could not be found. Make sure the NFC tag is configured correctly.</p>
          <p style={styles.code}>Code: {nfcCode}</p>
        </div>
      </main>
    )
  }

  // Success state
  return (
    <main style={styles.main}>
      <div style={styles.container}>

        {alreadyScanned ? (
          <div style={styles.pill}>Already in your journey</div>
        ) : (
          <div style={{ ...styles.pill, background: '#1a2e1f', color: '#4caf72', border: '1px solid #2a4a2f' }}>
            ✦ Added to journey
          </div>
        )}

        {artwork?.image_url && (
          <div style={styles.imageWrapper}>
            <img src={artwork.image_url} alt={artwork.title} style={styles.image} />
          </div>
        )}

        <div style={styles.artworkMeta}>
          <p style={styles.artist}>{artwork?.artist}</p>
          <h2 style={styles.artworkTitle}>{artwork?.title}</h2>
        </div>

        {artwork?.description && (
          <p style={styles.description}>{artwork.description}</p>
        )}

        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => router.push('/ready')}>
            Continue
          </button>
          <button style={styles.btnGhost} onClick={() => router.push('/exit')}>
            End Journey
          </button>
        </div>

      </div>
    </main>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: '#0a0a0a' }} />}>
      <ScanContent />
    </Suspense>
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
    gap: '1.25rem',
  },
  pill: {
    display: 'inline-block',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    padding: '0.4rem 0.8rem',
    background: '#111',
    color: '#555',
    border: '1px solid #1a1a1a',
    borderRadius: '100px',
    width: 'fit-content',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '4/3',
    overflow: 'hidden',
    background: '#111',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  artworkMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  artist: {
    fontSize: '0.8rem',
    color: '#555',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: 0,
  },
  artworkTitle: {
    fontSize: '1.8rem',
    fontWeight: '400',
    color: '#f0ede6',
    margin: 0,
    lineHeight: 1.2,
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: 1.7,
    margin: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem',
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
  btnGhost: {
    background: 'transparent',
    color: '#444',
    border: '1px solid #1a1a1a',
    padding: '0.8rem',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
  },
  label: {
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    color: '#333',
    textTransform: 'uppercase',
    margin: 0,
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
  code: {
    fontSize: '0.8rem',
    color: '#333',
    fontFamily: 'monospace',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid #1a1a1a',
    borderTop: '2px solid #555',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
}
