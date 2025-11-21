import React from "react";

export default function GlassAlert({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Alert Box */}
      <div
        className="
          relative p-6 rounded-2xl w-[320px]
          bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl
          text-black text-center
        "
      >
        <div className="text-lg font-semibold mb-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
          Notice
        </div>

        <p className="text-sm mb-5 leading-relaxed">{message}</p>

        <button
          onClick={onClose}
          className="
            w-full py-2 rounded-xl font-bold text-white
            bg-blue-500 hover:bg-blue-600
            [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]
          "
        >
          OK
        </button>
      </div>
    </div>
  );
}
