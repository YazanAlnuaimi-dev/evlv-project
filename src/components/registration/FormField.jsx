const CONTROL_CLASS =
  'w-full bg-zinc-900/50 border border-zinc-900 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all duration-300';

const LABEL_CLASS = 'block text-[10px] tracking-widest text-zinc-400 font-bold uppercase mb-2';

/**
 * One labelled form control, rendered from a field definition in
 * shared/registration.js (input, select or textarea).
 */
export default function FormField({ field, idPrefix, value, error, onChange }) {
  const id = `${idPrefix}-${field.name}`;
  const errorId = `${id}-error`;

  const shared = {
    id,
    name: field.name,
    value,
    onChange,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  let control;
  if (field.control === 'select') {
    control = (
      <select {...shared} className={CONTROL_CLASS}>
        <option value="" disabled className="text-zinc-500">
          {field.placeholder}
        </option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (field.control === 'textarea') {
    control = <textarea {...shared} rows={field.rows} className={`${CONTROL_CLASS} resize-none`} />;
  } else {
    control = (
      <input
        {...shared}
        type={field.type}
        placeholder={field.placeholder}
        className={CONTROL_CLASS}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {field.label}
      </label>
      {control}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
