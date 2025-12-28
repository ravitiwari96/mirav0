const keywords = [
  "Cruelty Free",
  "Vegan",
  "Plastic Free",
  "Biodegradable",
  "Sustainable",
  "Eco-Friendly",
  "Zero Waste",
  "Organic",
  "Natural",
  "Renewable",
];

const EcoKeywordsCarousel = () => {
  return (
    <section className="py-8 bg-primary/5 overflow-hidden">
      <div className="relative flex">
        {/* First set of keywords */}
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {keywords.map((keyword, index) => (
            <div
              key={`first-${index}`}
              className="inline-flex items-center px-6 py-2 mx-3 text-lg font-semibold text-primary"
            >
              <span className="mr-2">🌿</span>
              {keyword}
            </div>
          ))}
        </div>
        
        {/* Duplicate set for seamless loop */}
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap" aria-hidden="true">
          {keywords.map((keyword, index) => (
            <div
              key={`second-${index}`}
              className="inline-flex items-center px-6 py-2 mx-3 text-lg font-semibold text-primary"
            >
              <span className="mr-2">🌿</span>
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcoKeywordsCarousel;
