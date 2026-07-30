import { classNames } from '../../../utils/helpers';

const Skeleton = ({ className }) => (
  <div className={classNames('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className)} />
);

export default Skeleton;
