import AIChat from './AIChat';

const OutfitAdvisor = ({ weatherContext }) => (
  <AIChat type="outfit_advisor" weatherContext={weatherContext} />
);

export default OutfitAdvisor;
