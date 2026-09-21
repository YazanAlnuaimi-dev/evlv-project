import { useEffect, useId } from 'react';
import { REGISTRATION_TYPES } from '@shared/registration';
import { CloseIcon } from '@/components/icons/UiIcons';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import FormField from './FormField';
import RegistrationSuccess from './RegistrationSuccess';

/**
 * Modal with the onboarding form for one registration type.
 * Mounted only while open, so every opening starts from a clean form.
 *
 * @param {{ type: 'Talent' | 'Brand' | 'Agency', onClose: () => void }} props
 */
export default function RegistrationModal({ type, onClose }) {
  const { label, article, fields } = REGISTRATION_TYPES[type];
  const titleId = useId();
  const { values, status, error, handleChange, handleSubmit } = useRegistrationForm(type);
  const isSending = status === 'sending';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-[0_0_40px_rgba(0,217,255,0.1)] relative my-auto hover:border-white/30 transition-all duration-300"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-2 z-20"
        >
          <CloseIcon />
        </button>

        {status === 'success' ? (
          <RegistrationSuccess onClose={onClose} />
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] tracking-widest text-zinc-500 font-bold uppercase">
                EVLV / {label} PORTAL
              </span>
              <h3 id={titleId} className="text-xl font-bold text-white tracking-tight mt-1">
                Join as {article} {label}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  idPrefix={titleId}
                  value={values[field.name]}
                  error={error?.fields?.[field.name]}
                  onChange={handleChange}
                />
              ))}

              {status === 'error' && (
                <p role="alert" className="text-xs text-red-400 leading-relaxed">
                  {error.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-white hover:bg-zinc-100 text-black font-bold tracking-widest text-xs rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-white hover:border-white"
              >
                <span>{isSending ? 'TRANSMITTING...' : 'SUBMIT REGISTRATION'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
