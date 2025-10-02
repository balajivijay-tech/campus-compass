"use client";

import { useState } from 'react';
import { FileArrowUp, TextT } from 'phosphor-react';
import { extractTextFromPdf } from '@/lib/pdf-parser';

interface CurriculumInputProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

export function CurriculumInput({ onAnalyze, loading }: CurriculumInputProps) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'upload' | 'manual'>('upload');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      try {
        const extractedText = await extractTextFromPdf(file);
        setText(extractedText);
      } catch (err) {
        setError('Failed to parse PDF. Please try another file or paste the text manually.');
        setText('');
      }
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Analyze Curriculum</h3>
      <div className="flex border-b mb-4">
        <button
          onClick={() => setInputType('upload')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${inputType === 'upload' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FileArrowUp size={20} className="mr-2" />
          Upload PDF
        </button>
        <button
          onClick={() => setInputType('manual')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${inputType === 'manual' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <TextT size={20} className="mr-2" />
          Paste Text
        </button>
      </div>

      {inputType === 'upload' ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
          </label>
          <p className="mt-1 text-sm text-gray-500">PDF up to 10MB</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your curriculum or course description here..."
          className="block w-full h-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      )}

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}