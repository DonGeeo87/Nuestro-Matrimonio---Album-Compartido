
import React from 'react';
import { WeddingPhoto } from '../types.ts';
import { User, Clock, Tag, Download, MessageSquare, Video, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  photos: WeddingPhoto[];
}

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const downloadMedia = (url: string, id: string, type: 'image' | 'video') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `boda-rocio-matias-${id}.${type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="mb-4 p-6 bg-gray-50 rounded-full border border-dashed border-gray-200">
          <Tag className="w-12 h-12 text-gray-200" />
        </div>
        <p className="text-sm font-mono tracking-tight text-center">
          Aún no hay recuerdos compartidos.<br/>
          ¡Sé el primero en subir un momento especial!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {photos.map((item) => (
        <div 
          key={item.id} 
          className="group bg-white border border-[#d0d7de] rounded-lg overflow-hidden hover:border-[#afb8c1] transition-all duration-200 shadow-sm"
        >
          <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                <User className="w-3 h-3 text-rose-500" />
              </div>
              <span className="text-xs font-bold text-[#1f2328]">{item.author}</span>
            </div>
            <div className="flex items-center gap-2">
               {item.type === 'video' ? (
                <span className="px-2 py-0.5 bg-[#ddf4ff] text-[#0969da] text-[10px] font-bold rounded-full border border-[#54aeff]/30 flex items-center gap-1">
                  <Video className="w-3 h-3" /> VIDEO
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-[#dafbe1] text-[#1a7f37] text-[10px] font-bold rounded-full border border-[#4ac26b]/30 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> FOTO
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 aspect-square bg-gray-100 relative group-hover:bg-gray-200 transition-colors border-r border-[#d0d7de]">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Recuerdo de boda" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={item.url} 
                  className="w-full h-full object-cover" 
                  controls
                  playsInline
                />
              )}
              
              <button 
                onClick={() => downloadMedia(item.url, item.id, item.type)}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm border border-[#d0d7de] rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                title="Descargar archivo"
              >
                <Download className="w-4 h-4 text-[#1f2328]" />
              </button>
            </div>

            <div className="w-full lg:w-1/2 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-[#636c76]">
                  <MessageSquare className="w-4 h-4 text-rose-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Dedicatoria</span>
                </div>
                
                <p className="text-[#1f2328] font-serif text-base mb-6 leading-relaxed italic border-l-4 border-rose-100 pl-4 py-1">
                  "{item.dedication}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#636c76] pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                </div>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">
                  REF: {item.id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
