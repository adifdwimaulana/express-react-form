import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/types";
import apiClient from "@/utils/axios";

interface Props {
	config: FormField[];
	countryCode: string;
}

const DynamicForm = ({ config, countryCode }: Props) => {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, any>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setFormData({});
		setErrors({});
	}, []);

	if (config.length === 0) {
		return null;
	}

	const handleInputChange = (key: string, value: unknown) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const validate = () => {
		const newErrors: Record<string, any> = {};

		config.forEach((field) => {
			if (field.required && !formData[field.key]) {
				newErrors[field.key] = `${field.label} is required`;
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			const { data } = await apiClient.post<{ message: string }>(
				"/v1/addresses",
				{ countryCode, data: formData },
			);

			toast.success(data.message);
			setErrors({});
			setFormData({});
		} catch (error) {
			const message =
				error instanceof AxiosError
					? error.response?.data.message
					: "Unknown error";
			toast.error(`Failed to save address: ${message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderField = (field: FormField) => {
		const value = formData[field.key] || "";
		const hasError = !!errors[field.key];

		const className = `w-full ${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`;

		const handleChange = (value: unknown) => {
			handleInputChange(field.key, value);
		};

		switch (field.component) {
			case "select": {
				return (
					<Select value={value} onValueChange={handleChange}>
						<SelectTrigger className={className}>
							<SelectValue placeholder={`Select ${field.label}`} />
						</SelectTrigger>
						<SelectContent>
							{field.options.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}

			default:
				return (
					<Input
						id={field.key}
						type="text"
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						className={className}
					/>
				);
		}
	};

	return (
		<div className="space-y-4">
			{config.map((field) => (
				<div key={field.key} className="space-y-1">
					<Label
						htmlFor={field.key}
						className="text-sm font-medium text-gray-700"
					>
						{field.label}
						{field.required && <span className="text-red-500 ml-0.5">*</span>}
					</Label>
					{renderField(field)}
					{errors[field.key] && (
						<p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
					)}
				</div>
			))}

			<Button
				type="submit"
				className="w-full"
				onClick={handleSubmit}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2Icon className="animate-spin" />
						Please wait
					</>
				) : (
					"Save Address"
				)}
			</Button>
		</div>
	);
};

export default DynamicForm;
