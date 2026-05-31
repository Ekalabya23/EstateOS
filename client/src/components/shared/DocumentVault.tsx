import { useState, useCallback } from 'react';
import { UploadCloud, File, X, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

interface DocumentVaultProps {
  propertyId: string;
  initialDocuments?: string[];
  onUploadSuccess?: (docs: string[]) => void;
  readOnly?: boolean;
}

export default function DocumentVault({ 
  propertyId, 
  initialDocuments = [], 
  onUploadSuccess,
  readOnly = false 
}: DocumentVaultProps) {
  const [documents, setDocuments] = useState<string[]>(initialDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (readOnly) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [readOnly]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: globalThis.File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to local multer storage
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = res.data.data;
      
      // 2. Update Property with new document
      const newDocs = [...documents, fileUrl];
      await api.put(`/properties/${propertyId}`, { documents: newDocs });
      
      setDocuments(newDocs);
      if (onUploadSuccess) onUploadSuccess(newDocs);
      
      toast.success('Document uploaded to Vault');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (indexToRemove: number) => {
    if (readOnly) return;
    
    const newDocs = documents.filter((_, idx) => idx !== indexToRemove);
    try {
      await api.put(`/properties/${propertyId}`, { documents: newDocs });
      setDocuments(newDocs);
      if (onUploadSuccess) onUploadSuccess(newDocs);
      toast.success('Document removed');
    } catch (error) {
      toast.error('Failed to remove document');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-mist)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--color-charcoal)] font-display">Document Vault</h3>
          <p className="text-[12px] text-[var(--color-stone)] mt-1">Securely store deeds, leases, and floor plans.</p>
        </div>
      </div>

      {!readOnly && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
            isDragging 
              ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]/10' 
              : 'border-[var(--color-mist)] bg-[var(--color-warm-white)] hover:border-[var(--color-stone-light)]'
          }`}
        >
          <input
            type="file"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-[var(--color-champagne-dark)] animate-spin mb-3" />
              <p className="text-[13px] text-[var(--color-stone)] font-medium">Encrypting & Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <UploadCloud className="w-6 h-6 text-[var(--color-stone)]" />
              </div>
              <p className="text-[14px] font-medium text-[var(--color-charcoal)] mb-1">
                Drag & drop files here
              </p>
              <p className="text-[12px] text-[var(--color-stone)]">
                or click to browse from your computer
              </p>
            </div>
          )}
        </div>
      )}

      {/* Document List */}
      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-warm-white)] border border-[var(--color-mist)] group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0 border border-[var(--color-mist)]">
                  <File className="w-4 h-4 text-[var(--color-stone)]" />
                </div>
                <div className="truncate">
                  <a 
                    href={`http://localhost:5000${doc}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[13px] font-medium text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)] transition-colors truncate block"
                  >
                    {doc.split('-').pop() || 'Document'}
                  </a>
                  <p className="text-[11px] text-[var(--color-stone)] mt-0.5">Verified Asset File <CheckCircle className="inline w-3 h-3 text-green-500 ml-1" /></p>
                </div>
              </div>
              {!readOnly && (
                <button 
                  onClick={() => removeDocument(idx)}
                  className="p-1.5 text-[var(--color-stone-light)] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {documents.length === 0 && !isUploading && (
          <div className="text-center py-6 text-[13px] text-[var(--color-stone)]">
            No documents in the vault yet.
          </div>
        )}
      </div>
    </div>
  );
}
