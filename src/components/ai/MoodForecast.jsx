import AIChat from './AIChat';

const MoodForecast = ({ weatherContext }) => (
  <AIChat type="mood_forecast" weatherContext={weatherContext} />
);

export default MoodForecast;
