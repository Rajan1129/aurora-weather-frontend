import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { formatTemp } from '../../utils/helpers';

const CurrentWeatherCard = ({ weather, units = 'celsius', isLoading }) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-24" />
      </Card>
    );
  }

  if (!weather) return null;

  const { current } = weather;

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {current.condition?.description}
        </p>
        <p className="text-4xl font-semibold">{formatTemp(current.temp, units)}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Feels like {formatTemp(current.feelsLike, units)}
        </p>
      </div>
      {current.condition?.icon && (
        <img
          src={`https://openweathermap.org/img/wn/${current.condition.icon}@2x.png`}
          alt={current.condition.description}
          className="h-20 w-20"
        />
      )}
    </Card>
  );
};

export default CurrentWeatherCard;
