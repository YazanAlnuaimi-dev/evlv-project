import { useCallback, useState } from 'react';
import { createEmptyFormData } from '@shared/registration';
import { submitRegistration } from '@/lib/api';

/**
 * State machine for a registration form.
 *
 * status: 'idle' -> 'sending' -> 'success' | 'error' (an error returns to editing)
 *
 * @param {string} registrationType - 'Talent' | 'Brand' | 'Agency'
 */
export function useRegistrationForm(registrationType) {
  const [values, setValues] = useState(createEmptyFormData);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null); // { message: string, fields: Record<string,string> }

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setError((previous) => {
      if (!previous?.fields?.[name]) return previous;
      const { [name]: _cleared, ...remaining } = previous.fields;
      return { ...previous, fields: remaining };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setStatus('sending');
      setError(null);

      try {
        await submitRegistration(registrationType, values);
        setStatus('success');
      } catch (submitError) {
        setError({ message: submitError.message, fields: submitError.fieldErrors ?? {} });
        setStatus('error');
      }
    },
    [registrationType, values],
  );

  return { values, status, error, handleChange, handleSubmit };
}
