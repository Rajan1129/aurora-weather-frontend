const WeatherMap = ({ lat, lon, zoom = 8 }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
    <iframe
      title="Weather map"
      className="h-80 w-full"
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 1}%2C${lat - 1}%2C${lon + 1}%2C${lat + 1}&layer=mapnik&marker=${lat}%2C${lon}`}
    />
  </div>
);

export default WeatherMap;
