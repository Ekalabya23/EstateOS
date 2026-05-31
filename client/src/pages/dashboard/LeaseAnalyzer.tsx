import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Search, Bot, AlertTriangle, FileWarning, Info } from 'lucide-react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';

interface AnalysisResult {
  summary: string;
  keyTerms: {
    rentAmount: string | null;
    leaseStart: string | null;
    leaseEnd: string | null;
    noticePeriod: string | null;
    securityDeposit: string | null;
    maintenanceResponsibility: string | null;
  };
  redFlags: string[];
  tenantFavorable: string[];
  landlordFavorable: string[];
  missingClauses: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
}

export default function LeaseAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('contractFile', file);

    try {
      const response = await api.post('/ai/analyze-lease', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.data);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze lease agreement');
      setFile(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
          AI Lease Analyzer
        </h1>
        <p className="text-[var(--color-stone)]">
          Upload a lease agreement PDF to instantly extract key terms, identify red flags, and assess risks.
        </p>
      </div>

      {!result && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive ? 'border-[var(--color-champagne-dark)] bg-[var(--color-champagne)]/5' : 'border-[var(--color-mist)] hover:border-[var(--color-stone-light)] hover:bg-black/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6 border border-[var(--color-mist)]">
              {file ? (
                <FileText className="w-10 h-10 text-[var(--color-champagne-dark)]" />
              ) : (
                <Upload className="w-10 h-10 text-[var(--color-stone)]" />
              )}
            </div>
            
            {file ? (
              <div>
                <p className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">{file.name}</p>
                <p className="text-sm text-[var(--color-stone)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">Drag & drop your lease agreement</p>
                <p className="text-sm text-[var(--color-stone)] mb-6">or click to browse from your computer (PDF only)</p>
              </div>
            )}
          </div>

          {file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-center">
              <button
                onClick={handleAnalyze}
                className="px-8 py-4 bg-[var(--color-charcoal)] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex items-center gap-3 shadow-xl"
              >
                <Bot className="w-5 h-5 text-[var(--color-champagne)]" />
                Analyze Document
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {analyzing && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center py-24 space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[var(--color-mist)] rounded-full"></div>
            <div className="w-24 h-24 border-4 border-[var(--color-champagne-dark)] rounded-full border-t-transparent animate-spin absolute inset-0"></div>
            <Search className="w-10 h-10 text-[var(--color-charcoal)] absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[var(--color-charcoal)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>EstateOS AI is analyzing your lease...</h3>
            <p className="text-[var(--color-stone)]">Extracting clauses, checking compliance, and generating insights.</p>
          </div>
        </motion.div>
      )}

      {result && !analyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--color-charcoal)] flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              <Bot className="w-8 h-8 text-[var(--color-champagne-dark)]" />
              Analysis Results
            </h2>
            <button 
              onClick={() => { setResult(null); setFile(null); }}
              className="px-4 py-2 bg-white border border-[var(--color-mist)] rounded-lg text-sm font-medium hover:bg-[var(--color-warm-white)] transition-colors"
            >
              Analyze Another
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-charcoal)] mb-2">Executive Summary</h3>
                <p className="text-[var(--color-stone)] leading-relaxed max-w-3xl">{result.summary}</p>
              </div>
              <div className="shrink-0 text-center p-4 bg-[var(--color-warm-white)] rounded-2xl border border-[var(--color-mist)] min-w-[160px]">
                <p className="text-[11px] uppercase tracking-widest text-[var(--color-stone)] mb-2">Risk Level</p>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${getRiskColor(result.riskLevel)} inline-block`}>
                  {result.riskLevel} Risk
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[var(--color-mist)] shadow-sm">
              <h3 className="text-lg font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-stone)]" />
                Key Terms Extracted
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Rent Amount', value: result.keyTerms.rentAmount },
                  { label: 'Lease Start', value: result.keyTerms.leaseStart },
                  { label: 'Lease End', value: result.keyTerms.leaseEnd },
                  { label: 'Notice Period', value: result.keyTerms.noticePeriod },
                  { label: 'Security Deposit', value: result.keyTerms.securityDeposit },
                  { label: 'Maintenance', value: result.keyTerms.maintenanceResponsibility }
                ].map((term, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-[var(--color-mist)] last:border-0">
                    <span className="text-[13px] text-[var(--color-stone)]">{term.label}</span>
                    <span className="text-[14px] font-medium text-[var(--color-charcoal)] text-right max-w-[60%]">{term.value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
                <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Red Flags
                </h3>
                {result.redFlags?.length > 0 ? (
                  <ul className="space-y-3">
                    {result.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-rose-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-rose-700/60">No red flags identified.</p>
                )}
              </div>

              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <FileWarning className="w-5 h-5 text-amber-600" />
                  Missing Clauses
                </h3>
                {result.missingClauses?.length > 0 ? (
                  <ul className="space-y-3">
                    {result.missingClauses.map((clause, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-amber-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {clause}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-amber-700/60">No missing essential clauses identified.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-charcoal)] text-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-champagne)]">
              <Info className="w-5 h-5" />
              AI Recommendation
            </h3>
            <p className="text-lg leading-relaxed">{result.recommendation}</p>
          </div>

        </motion.div>
      )}

    </div>
  );
}
