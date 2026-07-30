import { useEffect } from 'react';

const VARIANT_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-slate-800',
};

const Toast = ({ id, message, variant = 'info', onDismiss, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg ${VARIANT_STYLES[variant]}`}>
      {message}
    </div>
  );
};

export default Toast;
