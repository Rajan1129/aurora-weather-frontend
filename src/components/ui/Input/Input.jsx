import { classNames } from '../../../utils/helpers';

const Input = ({ label, error, className, id, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
    )}
    <input
      id={id}
      className={classNames(
        'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-aurora-500 focus:ring-1 focus:ring-aurora-500 dark:border-slate-700 dark:bg-slate-900',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Input;
