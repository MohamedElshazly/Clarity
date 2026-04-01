import { getDistortionBySlug } from "@/lib/data/distortions";
import { notFound } from "next/navigation";

export default async function DistortionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const distortion = getDistortionBySlug(slug);

  if (!distortion) notFound();

  return (
    <main className="p-8">
      <h1 className="font-serif text-2xl">{distortion.name}</h1>
      <p className="mt-4 text-muted-foreground">{distortion.definition}</p>
    </main>
  );
}
