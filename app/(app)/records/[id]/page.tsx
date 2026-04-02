"use client";

import { RecordDetailClient } from "@/components/record/record-detail-client";

export default async function RecordDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <RecordDetailClient recordId={id} />;
}
