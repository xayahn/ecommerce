/**
 * Modal.jsx
 * Accessible modal dialog with backdrop, close on ESC + outside click.
 */

import { useEffect, useRef } from "react";
import { createPortal }      from "react-dom";
import { HiX }               from "react-icons/hi";
import clsx                  from "clsx";
import useScrollLock          from "../hooks/useScrollLock";

/**
 * @param {{
 *   isOpen:    boolean,
 *   onClose:   function,
 *   title?:    string,
 *   size?:     'sm' | 'md' | 'lg' | 'xl',
 *   children:  React.ReactNode,
 * }} props
 */
const Modal = ({ isOpen, onClose, title, size = "md", children }) => {
  useScrollLock(isOpen);
  const overlayRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return ()  => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/50 backdrop-blur-sm px-4 animate-fade-in"
    >
      <div
        className={clsx(
          "relative w-full bg-white rounded-2xl shadow-modal",
          "animate-slide-up overflow-hidden",
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700
                         hover:bg-neutral-100 transition"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Close button without title */}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400
                       hover:text-neutral-700 hover:bg-neutral-100 transition z-10"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;