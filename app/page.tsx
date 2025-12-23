'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateEmail = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setEmail('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, tone, length }),
      })

      const data = await response.json()
      setEmail(data.email)
    } catch (error) {
      setEmail('Error generating email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setPrompt('')
    setEmail('')
    setCopied(false)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Email Agent</h1>
        <p className={styles.subtitle}>AI-powered email composition assistant</p>

        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label htmlFor="prompt" className={styles.label}>
              What would you like to write about?
            </label>
            <textarea
              id="prompt"
              className={styles.textarea}
              placeholder="E.g., Request a meeting with my team to discuss Q1 results, apologize for a delayed response, thank someone for their help..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.optionsRow}>
            <div className={styles.formGroup}>
              <label htmlFor="tone" className={styles.label}>
                Tone
              </label>
              <select
                id="tone"
                className={styles.select}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="apologetic">Apologetic</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="length" className={styles.label}>
                Length
              </label>
              <select
                id="length"
                className={styles.select}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          <button
            className={styles.button}
            onClick={generateEmail}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>

        {email && (
          <div className={styles.card}>
            <div className={styles.resultHeader}>
              <h2 className={styles.resultTitle}>Generated Email</h2>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.secondaryButton}
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={clearAll}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className={styles.emailOutput}>
              {email}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
