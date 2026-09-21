import { CheckIcon } from '@/components/icons/UiIcons';

/** Confirmation shown after a registration has been delivered. */
export default function RegistrationSuccess({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black">
        <CheckIcon />
      </div>
      <h4 className="text-lg font-bold text-white tracking-tight">Onboarding Completed</h4>
      <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
        Your profile has been logged.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2 border border-zinc-800 text-xs text-zinc-400 hover:text-white rounded-full transition-colors mt-2"
      >
        CLOSE WINDOW
      </button>
    </div>
  );
}
