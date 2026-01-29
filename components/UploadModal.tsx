
import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Film, MessageSquareQuote, Check, Loader2 } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (data: { file: File; author: string; dedication: string }) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [dedication, setDedication] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !author) return;

    setIsUploading(true);
    try {
      await onUpload({ file, author, dedication });
      onClose();
    } catch (error) {
      alert("Error al subir. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-serif font-bold text-gray-800">Compartir Recuerdo</h3>
          <button onClick={onClose} disabled={isUploading} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!preview ? (
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-rose-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-rose-50 transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-rose-500" />
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">Toca para elegir foto o video</p>
                <p className="text-sm text-gray-400">Captura el amor de Rocío y Matías</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner bg-gray-900">
                {file?.type.startsWith('image') ? (
                  <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <video src={preview} className="w-full h-full object-contain" controls />
                )}
                {!isUploading && (
                  <button 
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Upload className="w-3 h-3" /> Tu Nombre
                  </label>
                  <input 
                    type="text" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="¿Quién eres?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 outline-none disabled:bg-gray-50"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <MessageSquareQuote className="w-3 h-3" /> Tu Dedicatoria
                  </label>
                  <textarea 
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="Un mensaje para los novios..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 outline-none resize-none disabled:bg-gray-50"
                    required
                    disabled={isUploading}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploading}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold tracking-widest uppercase shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subiendo a la nube...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Guardar para Siempre
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
