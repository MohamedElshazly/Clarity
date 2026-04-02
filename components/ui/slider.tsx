"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	value?: number[]
	defaultValue?: number[]
	onValueChange?: (value: number[]) => void
	min?: number
	max?: number
	step?: number
}

function Slider({
	className,
	value,
	defaultValue,
	onValueChange,
	min = 0,
	max = 100,
	step = 1,
	...props
}: SliderProps) {
	const [internalValue, setInternalValue] = React.useState(
		(value?.[0] ?? defaultValue?.[0] ?? min)
	)

	const currentValue = value?.[0] ?? internalValue

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value)
		setInternalValue(newValue)
		onValueChange?.([newValue])
	}

	const percentage = ((currentValue - min) / (max - min)) * 100

	return (
		<div className={cn("relative w-full", className)}>
			<div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full bg-primary transition-all"
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<input
				type="range"
				value={currentValue}
				onChange={handleChange}
				min={min}
				max={max}
				step={step}
				className="absolute inset-0 w-full cursor-pointer opacity-0"
				{...props}
			/>
			<div
				className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full border border-ring bg-white ring-ring/50 transition-all"
				style={{ left: `${percentage}%` }}
			/>
		</div>
	)
}

export { Slider }
