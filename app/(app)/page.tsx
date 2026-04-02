"use client";

import Link from "next/link";
import {
	Calendar,
	Flame,
	Target,
	Leaf,
	ArrowRight,
	PenLine,
} from "lucide-react";
import { getDistortionBySlug } from "@/lib/data/distortions";
import { getDailyQuote } from "@/lib/data/quotes";
import {
	getGreeting,
	formatDateHeader,
	formatShortDate,
	formatTime,
} from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useUserWithProfile } from "@/hooks/use-user";
import { useGetDashboardStats } from "@/hooks/use-dashboard";

export default function DashboardPage() {
	const { data: userWithProfile, isLoading: isLoadingUser } =
		useUserWithProfile();
	const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats();

	// Redirect to login if not authenticated (handled by layout)
	if (!userWithProfile) return null;

	// Show loading skeleton from loading.tsx during data fetch
	if (isLoadingUser || isLoadingStats) return null;

	const profile = userWithProfile.profile;
	const firstName = profile?.full_name?.split(" ")[0] ?? "friend";
	const greeting = getGreeting();
	const dateHeader = formatDateHeader(new Date());
	const dailyQuote = getDailyQuote();

	const mostCommonDistortion = stats?.mostCommonDistSlug
		? getDistortionBySlug(stats.mostCommonDistSlug)
		: null;

	return (
		<main className="max-w-5xl mx-auto">
			{/* Section 1: Greeting */}
			<section className="mb-12">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<p
							className="text-xs font-medium tracking-widest mb-3"
							style={{ color: "var(--tertiary)" }}
						>
							{dateHeader}
						</p>
						<h1
							className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] mb-4"
							style={{ color: "var(--on-surface)" }}
						>
							{greeting}, {firstName}
						</h1>
						<p
							className="text-base leading-relaxed max-w-xl"
							style={{ color: "var(--tertiary)" }}
						>
							Today is a fresh canvas for your thoughts. How are you feeling
							right now?
						</p>
					</div>

					<Link
						href="/record/new"
						className="clarity-btn-primary flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap mt-8 hover:opacity-90 transition-opacity"
					>
						<PenLine size={16} />
						New Thought Record
					</Link>
				</div>
			</section>

			{/* Section 2: Stat Chips */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
				{/* Activity Chip */}
				<div
					className="clarity-card flex items-center gap-4 p-5"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div
						className="p-3 rounded-lg"
						style={{ backgroundColor: "var(--surface-container-highest)" }}
					>
						<Calendar size={20} style={{ color: "var(--ms-primary)" }} />
					</div>
					<div className="flex-1">
						<p
							className="text-[10px] font-medium tracking-widest mb-1"
							style={{ color: "var(--tertiary)" }}
						>
							ACTIVITY
						</p>
						<p
							className="text-sm font-medium"
							style={{ color: "var(--on-surface)" }}
						>
							Records this week: {stats?.recordsThisWeek ?? 0}
						</p>
					</div>
				</div>

				{/* Progress Chip */}
				<div
					className="clarity-card flex items-center gap-4 p-5"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div
						className="p-3 rounded-lg"
						style={{ backgroundColor: "var(--surface-container-highest)" }}
					>
						<Flame size={20} style={{ color: "var(--ms-primary)" }} />
					</div>
					<div className="flex-1">
						<p
							className="text-[10px] font-medium tracking-widest mb-1"
							style={{ color: "var(--tertiary)" }}
						>
							PROGRESS
						</p>
						<p
							className="text-sm font-medium"
							style={{ color: "var(--on-surface)" }}
						>
							Current streak: {stats?.currentStreak ?? 0}{" "}
							{stats?.currentStreak === 1 ? "day" : "days"}
						</p>
					</div>
				</div>

				{/* Pattern Chip */}
				<div
					className="clarity-card flex items-center gap-4 p-5"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div
						className="p-3 rounded-lg"
						style={{ backgroundColor: "var(--surface-container-highest)" }}
					>
						<Target size={20} style={{ color: "var(--ms-primary)" }} />
					</div>
					<div className="flex-1">
						<p
							className="text-[10px] font-medium tracking-widest mb-1"
							style={{ color: "var(--tertiary)" }}
						>
							PATTERN
						</p>
						<p
							className="text-sm font-medium"
							style={{ color: "var(--on-surface)" }}
						>
							{mostCommonDistortion?.name ?? "None yet"}
						</p>
					</div>
				</div>
			</section>

			{/* Section 3: Recent Reflections */}
			<section className="mb-20">
				<div className="flex items-end justify-between mb-6">
					<h2
						className="font-serif italic text-2xl"
						style={{ color: "var(--on-surface)" }}
					>
						Recent Reflections
					</h2>
					<Link
						href="/records"
						className="text-sm font-medium hover:opacity-80 transition-opacity"
						style={{ color: "var(--ms-primary)" }}
					>
						View All Records
					</Link>
				</div>

				{!stats?.recentRecords || stats.recentRecords.length === 0 ? (
					<Card
						className="clarity-card p-8 text-center"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<p
							className="font-serif italic text-lg mb-3"
							style={{ color: "var(--on-surface)" }}
						>
							No records yet. Your first step toward clarity starts here.
						</p>
						<Link
							href="/record/new"
							className="inline-flex items-center gap-2 text-sm font-medium mt-2"
							style={{ color: "var(--ms-primary)" }}
						>
							Start your first thought record
							<ArrowRight size={14} />
						</Link>
					</Card>
				) : (
					<div className="flex flex-col gap-6">
						{stats.recentRecords.map((record) => {
							const primaryEmotion = record.emotions[0];
							const createdDate = new Date(record.created_at);

							return (
								<Link
									key={record.id}
									href={`/records/${record.id}`}
									className="clarity-card p-6 hover:opacity-90 transition-opacity block"
									style={{ backgroundColor: "var(--surface-container-high)" }}
								>
									<div className="flex gap-6">
										{/* Date column */}
										<div className="flex flex-col items-center min-w-16">
											<p
												className="text-base font-bold tracking-tight"
												style={{ color: "var(--on-surface)" }}
											>
												{formatShortDate(createdDate)}
											</p>
											<p
												className="text-xs mt-1"
												style={{ color: "var(--tertiary)" }}
											>
												{formatTime(createdDate)}
											</p>
										</div>

										{/* Content column */}
										<div className="flex-1 min-w-0">
											<p
												className="text-sm leading-relaxed mb-3 line-clamp-2"
												style={{ color: "var(--on-surface)" }}
											>
												"{record.situation}"
											</p>

											{/* Emotion badges */}
											{primaryEmotion && (
												<div className="flex items-center gap-3">
													<span
														className="text-xs px-3 py-1 rounded-full font-medium"
														style={{
															backgroundColor: "var(--surface-container-highest)",
															color: "var(--ms-primary)",
														}}
													>
														{primaryEmotion.label} (
														{primaryEmotion.intensity_before}/100)
													</span>
													<ArrowRight
														size={12}
														style={{ color: "var(--tertiary)" }}
													/>
													<span
														className="text-xs px-3 py-1 rounded-full font-medium"
														style={{
															backgroundColor: "var(--surface-container-highest)",
															color: "var(--on-surface)",
														}}
													>
														After reflection
													</span>
												</div>
											)}
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</section>

			{/* Section 4: Daily Grounding Quote */}
			<section className="text-center py-16 mb-12">
				<div className="flex justify-center mb-6">
					<Leaf size={32} style={{ color: "var(--ms-primary)" }} />
				</div>
				<blockquote
					className="font-serif italic text-[clamp(1.5rem,3vw,1.75rem)] leading-relaxed max-w-2xl mx-auto mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					"{dailyQuote.text}"
				</blockquote>
				<p
					className="text-[10px] font-medium tracking-widest"
					style={{ color: "var(--tertiary)" }}
				>
					DAILY GROUNDING
				</p>
			</section>
		</main>
	);
}
