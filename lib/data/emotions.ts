export type Emotion = {
  id: string;
  label: string;
  icon: string;
};

export const emotions: Emotion[] = [
  {
    id: "anxious",
    label: "Anxious",
    icon: "Zap",
  },
  {
    id: "sad",
    label: "Sad",
    icon: "CloudRain",
  },
  {
    id: "angry",
    label: "Angry",
    icon: "Flame",
  },
  {
    id: "ashamed",
    label: "Ashamed",
    icon: "EyeOff",
  },
  {
    id: "hopeless",
    label: "Hopeless",
    icon: "Anchor",
  },
  {
    id: "frustrated",
    label: "Frustrated",
    icon: "AlertCircle",
  },
  {
    id: "embarrassed",
    label: "Embarrassed",
    icon: "Frown",
  },
  {
    id: "guilty",
    label: "Guilty",
    icon: "Scale",
  },
];

export function getEmotionById(id: string): Emotion | undefined {
  return emotions.find((e) => e.id === id);
}
