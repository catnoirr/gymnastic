export const FoodIllustration = () => (
  <svg width="200" height="200" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
    <circle cx="400" cy="300" r="250" fill="#F3F4F6"/>
    <path d="M300 200C300 200 350 150 400 150C450 150 500 200 500 200" stroke="#4F46E5" strokeWidth="20" strokeLinecap="round"/>
    <circle cx="300" cy="350" r="40" fill="#4F46E5"/>
    <circle cx="500" cy="350" r="40" fill="#4F46E5"/>
  </svg>
);

export const HealthyFoodPattern = () => (
  <div className="absolute inset-0 -z-10 opacity-[0.02]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <pattern id="healthy-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 30c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#healthy-pattern)"/>
    </svg>
  </div>
); 