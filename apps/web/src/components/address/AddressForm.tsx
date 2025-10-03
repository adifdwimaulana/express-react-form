import { Edit3, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "@/components/ui/sonner";
import type { FormConfig, FormField, Place } from "@/types";
import apiClient from "@/utils/axios";
import CountrySelect from "./CountrySelect";
import DynamicForm from "./DynamicForm";
import GooglePlacesInput from "./GooglePlacesInput";

type Mode = "autocomplete" | "manual";

const COUNTRY_OPTIONS = [
	{ code: "USA", name: "United States" },
	{ code: "AUS", name: "Australia" },
	{ code: "IDN", name: "Indonesia" },
];

const AddressForm = () => {
	const [mode, setMode] = useState<Mode>("autocomplete");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [formConfig, setFormConfig] = useState<FormField[]>([]);

	const onChangeFormMode = () => {
		if (mode === "autocomplete") {
			setMode("manual");
			return;
		}

		setMode("autocomplete");
	};

	const onChangeCountry = (countryCode: string) => {
		setSelectedCountry(countryCode);
	};

	useEffect(() => {
		async function fetchFormConfig() {
			if (!selectedCountry) return;

			try {
				const response = await apiClient.get<FormConfig>(
					`/v1/forms/${selectedCountry}`,
				);

				const { config } = response.data;
				setFormConfig(config);
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				toast.error(`Failed to load form config: ${message}`, {
					duration: 3000,
				});
			}
		}

		fetchFormConfig();
	}, [selectedCountry]);

	const isAutoComplete = mode === "autocomplete";

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<Toaster />

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Address Form
						</h1>
						<p className="text-gray-600">
							Fill out the form below to provide your address details.
						</p>
					</div>

					{/* Country Selection */}
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Step 1: Select Country</CardTitle>
						</CardHeader>
						<CardContent>
							<CountrySelect
								countries={COUNTRY_OPTIONS}
								selectedCountry={selectedCountry}
								onChangeCountry={onChangeCountry}
							/>
						</CardContent>
					</Card>

					{/* Form Detail */}
					{selectedCountry && (
						<Card>
							<CardHeader className="space-y-0 pb-4">
								<CardTitle>Step 2: Enter Address</CardTitle>
								<div className="flex items-center justify-between pt-2">
									<p className="text-sm text-gray-600">
										Choose how you'd like to enter your address
									</p>
									<Button
										variant="outline"
										size="sm"
										onClick={onChangeFormMode}
										data-testid="toggle-input-mode-btn"
										className="flex items-center gap-2"
									>
										{isAutoComplete ? (
											<>
												<Edit3 className="w-4 h-4" /> Manual Edit
											</>
										) : (
											<>
												<MapPin className="w-4 h-4" /> Google Places
											</>
										)}
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{isAutoComplete ? (
									<GooglePlacesInput countryCode={selectedCountry} />
								) : (
									<DynamicForm
										config={formConfig}
										countryCode={selectedCountry}
									/>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddressForm;
