import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../utils/api.js';

const AISummary = ({ tripId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAISummary = async () => {
    setLoading(true);
    setError(null);
    try {
      // AI calls can take longer, so use extended timeout
      const { data } = await api.get(`/summary/ai/${tripId}`, {
        timeout: 60000, // 60 seconds for AI generation
      });
      setSummary(data.summary);
    } catch (err) {
      let errorMessage = 'Failed to generate AI summary. Please try again.';
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The AI is taking longer than expected. Please try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('AI Summary Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              AI Trip Summary
            </h3>
            <p className="text-xs text-slate-500">
              Powered by Google Gemini 2.5 Pro
            </p>
          </div>
        </div>
        {!loading && (
          <button
            onClick={fetchAISummary}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:bg-slate-700 dark:text-indigo-400 dark:hover:bg-slate-600"
          >
            <RefreshCw className="h-3 w-3" />
            {summary ? 'Regenerate' : 'Generate'}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            AI is analyzing your trip expenses...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This may take 15-30 seconds
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-900/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
                Error generating summary
              </p>
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </p>
              <button
                onClick={fetchAISummary}
                className="mt-3 text-xs font-medium text-rose-700 underline dark:text-rose-300"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {summary && !loading && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm dark:border-indigo-900/40 dark:bg-slate-700/50">
            <div
              className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300"
              dangerouslySetInnerHTML={{
                __html: summary
                  .replace(/\n/g, '<br />')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/### (.*?)(<br \/>|$)/g, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
                  .replace(/## (.*?)(<br \/>|$)/g, '<h2 class="text-lg font-semibold mt-5 mb-3">$1</h2>')
                  .replace(/^(\d+\.\s.*?)(<br \/>|$)/gm, '<p class="ml-4">$1</p>')
                  .replace(/^- (.*?)(<br \/>|$)/gm, '<li class="ml-6 list-disc">$1</li>'),
              }}
            />
          </div>
        </div>
      )}

      {!summary && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-700/30">
          <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
            Get an AI-powered explanation
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Click "Generate" to get a detailed breakdown of your trip expenses
          </p>
        </div>
      )}
    </div>
  );
};

export default AISummary;

