'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

function countKeys(obj: any): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countKeys(item), 0);
  return Object.keys(obj).length + Object.values(obj).reduce((sum, val) => sum + countKeys(val), 0);
}

function formatJSON(input: string, indent: number = 2) {
  try {
    const trimmed = input.trim();
    if (!trimmed) return { formatted: '', error: 'Input is empty', isValid: false, stats: { lines: 0, size: 0, keys: 0 } };
    const parsed = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, indent);
    return { formatted, error: null, isValid: true, stats: { lines: formatted.split('\n').length, size: formatted.length, keys: countKeys(parsed) } };
  } catch (e) {
    return { formatted: '', error: e instanceof Error ? e.message : 'Invalid JSON', isValid: false, stats: { lines: 0, size: 0, keys: 0 } };
  }
}

function minifyJSON(input: string) {
  try {
    const parsed = JSON.parse(input.trim());
    const minified = JSON.stringify(parsed);
    return { formatted: minified, error: null, isValid: true, stats: { lines: 1, size: minified.length, keys: countKeys(parsed) } };
  } catch (e) {
    return { formatted: '', error: e instanceof Error ? e.message : 'Invalid JSON', isValid: false, stats: { lines: 0, size: 0, keys: 0 } };
  }
}

export default function Home() {
  const [input, setInput] = useState('{"example":"paste JSON here"}');
  const [result, setResult] = useState(formatJSON('{"example":"paste JSON here"}'));
  const [indent, setIndent] = useState(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div><h1 className="text-2xl font-bold">JSON Formatter</h1></div>
          <div className="flex gap-3">
            <Link href="/pricing" className="text-slate-600">Pricing</Link>
            <Link href="/auth" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Login</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">JSON Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-4 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Output</label>
            <textarea value={result.formatted} readOnly className="flex-1 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm" />
          </div>
        </div>

        {result.error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{result.error}</div>}
        
        {result.isValid && <div className="mb-4 grid grid-cols-4 gap-4">
          <div className="px-4 py-3 bg-white border rounded"><p className="text-xs text-slate-500">Lines</p><p className="text-xl font-bold">{result.stats.lines}</p></div>
          <div className="px-4 py-3 bg-white border rounded"><p className="text-xs text-slate-500">Size</p><p className="text-xl font-bold">{result.stats.size}B</p></div>
          <div className="px-4 py-3 bg-white border rounded"><p className="text-xs text-slate-500">Keys</p><p className="text-xl font-bold">{result.stats.keys}</p></div>
          <div className="px-4 py-3 bg-white border rounded"><p className="text-xs text-slate-500">Valid</p><p className="text-xl font-bold text-green-600">✓</p></div>
        </div>}

        <div className="flex gap-3">
          <button onClick={() => setResult(formatJSON(input, indent))} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Format</button>
          <button onClick={() => setResult(minifyJSON(input))} className="px-6 py-2 bg-slate-600 text-white rounded-lg">Minify</button>
          <button onClick={() => navigator.clipboard.writeText(result.formatted)} className="px-6 py-2 bg-green-600 text-white rounded-lg">Copy</button>
          <select value={indent} onChange={(e) => setIndent(parseInt(e.target.value))} className="px-4 py-2 border rounded">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </main>
    </div>
  );
}