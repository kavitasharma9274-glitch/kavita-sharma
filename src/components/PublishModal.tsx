import React, { useState } from 'react';
import { LetterData } from '../types';
import { encodeLetterToHash } from '../utils/urlSharing';
import {
  X,
  Copy,
  Check,
  Share2,
  Printer,
  ExternalLink,
  MessageCircle,
  Smartphone,
  QrCode,
} from 'lucide-react';

interface PublishModalProps {
  letter: LetterData;
  onClose: () => void;
  onOpenRecipientView: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  letter,
  onClose,
  onOpenRecipientView,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Generate URL
  const hash = encodeLetterToHash(letter);
  const shareUrl = `${window.location.origin}${window.location.pathname}#letter=${hash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const romanticMessage = `My love, I made something special for you. Open this sealed letter when you have a quiet moment: ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    romanticMessage
  )}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(romanticMessage)}`;

  // Simple clean SVG QR Code generator representation
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=FFFFFF&color=1C1917&margin=1`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-cinematic">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-stone-200 relative text-stone-900 transition-all duration-400 ease-cinematic">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Share2 size={22} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-sans text-stone-400 block">
            Love Letter Ready
          </span>
          <h2 className="text-2xl font-serif-editorial font-semibold text-stone-900 mt-0.5">
            Send to {letter.recipientName || 'Her'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Anyone with this private link will experience the sealed envelope, wax seal unsealing, music, and your handwritten words.
          </p>
        </div>

        {/* Shareable Link Input & Copy */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Private Letter Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg text-stone-700 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors"
          >
            <MessageCircle size={16} />
            <span>Send WhatsApp</span>
          </a>

          <a
            href={smsUrl}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-semibold transition-colors"
          >
            <Smartphone size={16} />
            <span>Send iMessage / SMS</span>
          </a>
        </div>

        {/* QR Code Toggle */}
        <div className="border-t border-stone-100 pt-4 mb-4 text-center">
          <button
            onClick={() => setShowQr(!showQr)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            <QrCode size={14} />
            <span>{showQr ? 'Hide QR Code' : 'Show Phone QR Code'}</span>
          </button>

          {showQr && (
            <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 inline-block">
              <img
                src={qrCodeApiUrl}
                alt="Love letter QR Code"
                className="w-44 h-44 mx-auto rounded shadow-xs"
                loading="lazy"
              />
              <span className="text-[10px] text-stone-500 font-sans block mt-2">
                Have her point her camera here to open on mobile
              </span>
            </div>
          )}
        </div>

        {/* Recipient Experience Preview */}
        <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
          >
            <Printer size={14} />
            <span>Print Keepsake</span>
          </button>

          <button
            onClick={onOpenRecipientView}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Experience as Recipient</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
