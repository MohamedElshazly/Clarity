export type DistortionCategory =
  | "judgment-based"
  | "future-focused"
  | "social"
  | "emotional"
  | "perspective"
  | "self-identity";

export type Distortion = {
  slug: string;
  name: string;
  category: DistortionCategory;
  definition: string;
  example: string;
  counterQuestion: string;
  icon: string;
};

export const distortions: Distortion[] = [
  {
    slug: "all-or-nothing-thinking",
    name: "All-or-Nothing Thinking",
    category: "judgment-based",
    definition:
      "Seeing things in black and white, with no middle ground. If a situation falls short of perfect, it's seen as a total failure.",
    example: '"I made one mistake in the presentation, so the whole thing was a disaster."',
    counterQuestion: "Is there a middle ground between perfect and total failure here?",
    icon: "ToggleLeft",
  },
  {
    slug: "catastrophising",
    name: "Catastrophising",
    category: "future-focused",
    definition:
      "Blowing things out of proportion, or shrinking them inappropriately. Imagining the worst possible outcome is inevitable.",
    example: '"If I fail this exam, my entire career is ruined."',
    counterQuestion: "What is the realistic worst case, and how likely is it really?",
    icon: "Bomb",
  },
  {
    slug: "mind-reading",
    name: "Mind Reading",
    category: "social",
    definition:
      "Assuming you know what others are thinking — usually that they're reacting negatively to you — without any real evidence.",
    example: '"She didn\'t reply quickly, so she must be angry with me."',
    counterQuestion: "What evidence do I actually have for what they're thinking?",
    icon: "BrainCircuit",
  },
  {
    slug: "fortune-telling",
    name: "Fortune Telling",
    category: "future-focused",
    definition:
      "Predicting the future negatively and treating the prediction as a fact, leading to anxiety about events that may never happen.",
    example: '"I know the interview is going to go badly."',
    counterQuestion: "How many times have my negative predictions actually come true?",
    icon: "Telescope",
  },
  {
    slug: "emotional-reasoning",
    name: "Emotional Reasoning",
    category: "emotional",
    definition:
      "Assuming that because you feel a certain way, it must be true. Emotions are treated as evidence about reality.",
    example: '"I feel like a fraud, so I must be one."',
    counterQuestion: "Is my feeling a fact, or is it a feeling about a situation?",
    icon: "HeartCrack",
  },
  {
    slug: "personalisation",
    name: "Personalisation",
    category: "self-identity",
    definition:
      "Holding yourself personally responsible for events that aren't entirely under your control, or blaming yourself for others' emotions.",
    example: '"My friend is in a bad mood — it must be something I did."',
    counterQuestion: "What other factors, outside my control, could explain this?",
    icon: "UserX",
  },
  {
    slug: "should-statements",
    name: "Should Statements",
    category: "judgment-based",
    definition:
      "Rigid rules about how you or others must behave. Violating these rules triggers guilt, frustration, or resentment.",
    example: '"I should always be productive. I shouldn\'t need to rest."',
    counterQuestion: "Where did this rule come from, and is it actually fair?",
    icon: "Gavel",
  },
  {
    slug: "overgeneralisation",
    name: "Overgeneralisation",
    category: "perspective",
    definition:
      "Drawing a sweeping conclusion from a single event, and applying it as a general rule across all situations.",
    example: '"This went wrong, so everything always goes wrong for me."',
    counterQuestion: "Is this one event actually representative of a pattern?",
    icon: "Waves",
  },
  {
    slug: "mental-filter",
    name: "Mental Filter",
    category: "perspective",
    definition:
      "Focusing exclusively on one negative detail while ignoring the broader picture, like a drop of ink that colours an entire glass of water.",
    example: '"The feedback had one criticism, so the whole review must be negative."',
    counterQuestion: "What am I filtering out that might give a more complete picture?",
    icon: "Filter",
  },
  {
    slug: "discounting-positives",
    name: "Discounting Positives",
    category: "judgment-based",
    definition:
      "Dismissing positive experiences by insisting they don't count, which maintains a negative self-view even in the face of evidence to the contrary.",
    example: '"I only got the compliment because they were being polite."',
    counterQuestion: "If a friend discounted their wins like this, what would I say?",
    icon: "ThumbsDown",
  },
  {
    slug: "labelling",
    name: "Labelling",
    category: "self-identity",
    definition:
      "Attaching a fixed, global label to yourself or others based on a specific behaviour or event, rather than describing the behaviour.",
    example: '"I forgot the meeting. I\'m such an idiot."',
    counterQuestion: "Is this label accurate, or is it one moment within a much fuller picture?",
    icon: "Tag",
  },
  {
    slug: "magnification",
    name: "Magnification",
    category: "perspective",
    definition:
      "Exaggerating the importance of your problems, shortcomings, or others' achievements, while minimising your own strengths.",
    example: '"Everyone else handled that so easily. My struggle proves I\'m weak."',
    counterQuestion: "Am I applying the same scale to myself that I would apply to others?",
    icon: "ZoomIn",
  },
];

export function getDistortionBySlug(slug: string): Distortion | undefined {
  return distortions.find((d) => d.slug === slug);
}

export function getDistortionsByCategory(
  category: DistortionCategory
): Distortion[] {
  return distortions.filter((d) => d.category === category);
}
