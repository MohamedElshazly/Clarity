export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-8">
      <p className="text-muted-foreground">Record {id} — coming soon</p>
    </main>
  );
}
