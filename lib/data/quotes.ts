export type Quote = {
  text: string;
  attribution: string;
  label: string;
};

export const quotes: Quote[] = [
  {
    text: "You are not your thoughts; you are the awareness observing them.",
    attribution: "CBT Principle",
    label: "Defusion",
  },
  {
    text: "Your thoughts are like waves; you cannot stop them from coming, but you can choose which ones to surf.",
    attribution: "Jon Kabat-Zinn (adapted)",
    label: "Acceptance",
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    attribution: "Viktor E. Frankl",
    label: "Agency",
  },
  {
    text: "The mind is like a river — thoughts flow through it. You don't have to jump in and be swept away.",
    attribution: "Mindfulness tradition",
    label: "Observation",
  },
  {
    text: "A thought is just a thought. It only becomes a problem when you believe it without question.",
    attribution: "Byron Katie (adapted)",
    label: "Inquiry",
  },
  {
    text: "You can't stop the storm, but you can learn to sit quietly in the rain.",
    attribution: "Unknown",
    label: "Equanimity",
  },
  {
    text: "Feelings are not facts. They are signals worth listening to, not commands worth obeying.",
    attribution: "CBT Principle",
    label: "Emotional Reasoning",
  },
  {
    text: "Every thought you have does not need your full attention. Some thoughts are just passing weather.",
    attribution: "Russ Harris (adapted)",
    label: "Mindfulness",
  },
  {
    text: "You are doing the work. That is already something most people never do.",
    attribution: "Clarity",
    label: "Self-Compassion",
  },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
