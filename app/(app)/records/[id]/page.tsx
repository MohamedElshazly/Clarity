"use client";

import { RecordDetailClient } from "@/components/record/record-detail-client";
import { use } from "react";

export default function RecordDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	return <RecordDetailClient recordId={id} />;
}
