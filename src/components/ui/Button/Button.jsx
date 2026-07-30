import { classNames } from '../../../utils/helpers';

const VARIANTS = {
  primary: 'bg-aurora-600 text-white hover:bg-aurora-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
};

const Button = ({ variant = 'primary', className, children, ...props }) => (
  <button
    className={classNames(
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      VARIANTS[variant],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
