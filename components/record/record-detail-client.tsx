"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useDeleteRecord } from "@/hooks/use-records";
import { useUser } from "@/hooks/use-user";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecordView } from "@/components/record/record-view";
import { RecordEdit } from "@/components/record/record-edit";
import { RecordDetailSkeleton } from "@/components/skeletons/record-detail-skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface RecordDetailClientProps {
	recordId: string;
}

export function RecordDetailClient({ recordId }: RecordDetailClientProps) {
	const router = useRouter();
	const { data: user } = useUser();
	const { data: record, isPending: isLoading } = useRecord(recordId);
	const deleteRecord = useDeleteRecord();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [activeTab, setActiveTab] = useState<"view" | "edit">("view");

	// Handle delete
	const handleDelete = async () => {
		try {
			await deleteRecord.mutateAsync(recordId);
			router.push("/records");
		} catch (error) {
			console.error("Delete failed:", error);
		}
	};

	// Show skeleton during loading
	if (isLoading) return <RecordDetailSkeleton />;

	// Not found or unauthorized
	if (!record || record.user_id !== user?.id) {
		router.push("/records");
		return null;
	}

	return (
		<main className="max-w-4xl mx-auto px-6 py-12">
			{/* Back link */}
			<Link
				href="/records"
				className="inline-flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
				style={{ color: "var(--tertiary)" }}
			>
				<ChevronLeft size={16} />
				Back to Records
			</Link>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "view" | "edit")}>
				<TabsList
					className="mb-8 border-0"
					style={{
						backgroundColor: "var(--surface-container-high)",
					}}
				>
					<TabsTrigger
						value="view"
						style={{
							color: activeTab === "view" ? "var(--on-surface)" : "var(--tertiary)",
						}}
					>
						View
					</TabsTrigger>
					<TabsTrigger
						value="edit"
						style={{
							color: activeTab === "edit" ? "var(--on-surface)" : "var(--tertiary)",
						}}
					>
						Edit
					</TabsTrigger>
				</TabsList>

				<TabsContent value="view">
					<RecordView record={record} onDelete={() => setShowDeleteDialog(true)} />
				</TabsContent>

				<TabsContent value="edit">
					<RecordEdit record={record} onSuccess={() => setActiveTab("view")} />
				</TabsContent>
			</Tabs>

			{/* Delete confirmation dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent
					style={{
						backgroundColor: "var(--surface-container-high)",
						borderColor: "var(--outline-variant)",
					}}
				>
					<AlertDialogHeader>
						<AlertDialogTitle
							className="font-serif text-2xl"
							style={{ color: "var(--on-surface)" }}
						>
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription style={{ color: "var(--tertiary)" }}>
							This reflection will be permanently deleted. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							style={{
								backgroundColor: "var(--surface-container-highest)",
								color: "var(--on-surface)",
								border: "none",
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleteRecord.isPending}
							className="rounded-full"
							style={{
								backgroundColor: "var(--primary-container)",
								color: "var(--on-primary-container)",
							}}
						>
							{deleteRecord.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</main>
	);
}
