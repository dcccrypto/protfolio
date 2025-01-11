'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaPlay, FaCode, FaDownload } from 'react-icons/fa'

const INITIAL_CODE = `// Welcome to my interactive code playground!
// Try modifying this code and see the results in real-time.

function generateFibonacci(n) {
  const sequence = [0, 1];
  
  for (let i = 2; i < n; i++) {
    sequence[i] = sequence[i-1] + sequence[i-2];
  }
  
  return sequence;
}

// Generate first 10 Fibonacci numbers
const result = generateFibonacci(10);
console.log("Fibonacci Sequence:", result);
`

export default function LiveCodeEditor() {
  const [code, setCode] = useState(INITIAL_CODE)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const runCode = () => {
    try {
      // Create a safe environment to run the code
      const consoleOutput: string[] = []
      const safeConsole = {
        log: (...args: any[]) => consoleOutput.push(args.join(' ')),
        error: (...args: any[]) => consoleOutput.push('Error: ' + args.join(' ')),
        warn: (...args: any[]) => consoleOutput.push('Warning: ' + args.join(' '))
      }

      // Create a function from the code and run it in a safe context
      const fn = new Function('console', code)
      fn(safeConsole)

      setOutput(consoleOutput.join('\n'))
      setError('')
    } catch (err: any) {
      setError(err.message)
      setOutput('')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code-playground.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Interactive Code Playground</h3>
        <div className="flex gap-2">
          <button
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaPlay />
            Run Code
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <FaDownload />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute top-2 left-2 text-gray-400">
            <FaCode />
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] p-4 pl-8 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-4">
          <div className="h-[400px] overflow-auto rounded-lg">
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              className="h-full"
            >
              {code}
            </SyntaxHighlighter>
          </div>

          {(output || error) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                error ? 'bg-red-100 text-red-800' : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <h4 className="font-semibold mb-2">
                {error ? 'Error' : 'Output'}:
              </h4>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {error || output}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 