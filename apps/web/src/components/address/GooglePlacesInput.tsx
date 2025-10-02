import { AxiosError } from "axios";
import { Loader2Icon, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import type { Place } from "@/types";
import apiClient from "@/utils/axios";
import sdkClient from "@/utils/sdk";

interface Props {
	countryCode: string;
}

const GooglePlacesInput = ({ countryCode }: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [suggestions, setSuggestions] = useState<Place[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOpenPanel, setIsOpenPanel] = useState(false);

	const debouncedInput = useDebounce(inputValue, 500);

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInputValue(e.target.value);
	};

	const fetchSuggestion = useCallback(async () => {
		if (debouncedInput.length === 0) {
			setSuggestions([]);
			return;
		}

		if (debouncedInput.length < 3) {
			return;
		}

		setIsLoading(true);
		try {
			const { data } = await sdkClient.post<{ places: Place[] }>(
				"/places:searchText",
				{
					textQuery: debouncedInput,
				},
			);

			setSuggestions(data.places || []);
			setIsOpenPanel(true);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error(`Failed to fetch address suggestions: ${message}`);
			setSuggestions([]);
			setIsOpenPanel(false);
		} finally {
			setIsLoading(false);
		}
	}, [debouncedInput]);

	const onSelectSuggestion = (suggestion: Place) => {
		setInputValue(suggestion.displayName.text);
		setSelectedPlace(suggestion);
		setIsOpenPanel(false);
	};

	useEffect(() => {
		fetchSuggestion();
	}, [fetchSuggestion]);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await apiClient.post<{ message: string }>(
				"/v1/addresses",
				{ countryCode, data: selectedPlace },
			);

			toast.success(data.message);
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

	return (
		<div className="relative w-full">
			<div className="relative">
				<MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
				<Input
					type="text"
					value={inputValue}
					onChange={onChangeInput}
					placeholder="Enter your address"
					className="pl-10"
				/>
				{isLoading && (
					<div className="absolute right-3 top-3">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
					</div>
				)}
			</div>

			{suggestions.length > 0 && isOpenPanel && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
					{suggestions.map((suggestion) => (
						// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						<div
							role="button"
							key={suggestion.id}
							className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
							onClick={() => onSelectSuggestion(suggestion)}
						>
							<p className="font-medium text-sm">
								{suggestion.displayName.text}
							</p>
							<div>
								<div className="font-light text-sm text-gray-900">
									{suggestion.formattedAddress}
								</div>
								<div className="text-xs text-gray-500">
									{suggestion.displayName.languageCode || ""}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<Button
				type="submit"
				className="w-full mt-8"
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

export default GooglePlacesInput;
