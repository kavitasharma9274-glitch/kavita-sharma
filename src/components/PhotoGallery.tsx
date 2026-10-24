import React, { useState } from 'react';
import { PhotoMemory, ThemeId } from '../types';
import { X, ZoomIn, Calendar, MapPin } from 'lucide-react';

interface PhotoGalleryProps {
  photos: PhotoMemory[];
  theme: ThemeId;
  isEditable?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  theme,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="my-10 pt-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-widest font-sans opacity-60 block">
          Chapter of Moments
        </span>
        <h3 className="text-xl md:text-2xl font-serif-editorial font-medium mt-1">
          Memories We Hold Dear
        </h3>
        <div className="w-16 h-px bg-current opacity-25 mx-auto mt-2" />
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start justify-center">
        {photos.map((photo, index) => {
          // Asymmetric slight rotation for natural scrapbook aesthetic
          const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-0'];
          const rotationClass = rotations[index % rotations.length];

          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group cursor-pointer p-3 pb-5 bg-white rounded-xs shadow-md hover:shadow-xl transition-all duration-400 ease-cinematic transform hover:-translate-y-2 hover:rotate-0 text-stone-800 ${rotationClass} border border-stone-200/80`}
              style={{
                boxShadow: '0 8px 20px -4px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {/* Washi tape visual detail on top */}
              <div className="w-12 h-3.5 bg-amber-100/70 border border-amber-300/40 -mt-5 mb-2 mx-auto shadow-xs opacity-75 transform -rotate-1 rounded-2xs" />

              {/* Photo Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100 rounded-2xs">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Memory photograph'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container if broken
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 text-stone-800 p-2 rounded-full shadow-md">
                    <ZoomIn size={16} />
                  </div>
                </div>
              </div>

              {/* Polaroid Caption & Details */}
              <div className="mt-3 px-1 text-center">
                <h4 className="font-handwriting text-lg font-bold text-stone-900 tracking-wide">
                  {photo.caption || 'Our Special Day'}
                </h4>

                {photo.dateLocation && (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-sans mt-0.5">
                    <span>{photo.dateLocation}</span>
                  </div>
                )}

                {photo.description && (
                  <p className="mt-2 text-xs text-stone-600 font-serif italic line-clamp-3 leading-relaxed">
                    "{photo.description}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-lg p-4 md:p-6 shadow-2xl text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="aspect-4/3 w-full rounded overflow-hidden bg-stone-100 mb-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center max-w-lg mx-auto">
              <h3 className="font-handwriting text-2xl font-bold text-stone-900">
                {selectedPhoto.caption}
              </h3>
              {selectedPhoto.dateLocation && (
                <p className="text-xs text-stone-500 font-sans uppercase tracking-wider mt-1">
                  {selectedPhoto.dateLocation}
                </p>
              )}
              {selectedPhoto.description && (
                <p className="mt-3 text-stone-700 font-serif italic text-sm md:text-base leading-relaxed">
                  "{selectedPhoto.description}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
