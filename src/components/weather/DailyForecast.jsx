import Card from '../ui/Card';
import { formatTemp } from '../../utils/helpers';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DailyForecast = ({ daily = [], units = 'celsius' }) => (
  <Card>
    <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
      7-day forecast
    </h3>
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {daily.map((day) => (
        <li key={day.dt} className="flex items-center justify-between py-2 text-sm">
          <span className="w-10 font-medium">{DAY_LABELS[new Date(day.dt * 1000).getDay()]}</span>
          {day.weather?.[0]?.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="h-8 w-8"
            />
          )}
          <span className="text-slate-500 dark:text-slate-400">
            {formatTemp(day.temp?.min, units)} / {formatTemp(day.temp?.max, units)}
          </span>
        </li>
      ))}
    </ul>
  </Card>
);

export default DailyForecast;
