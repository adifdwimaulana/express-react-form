import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Props {
	countries: Array<{ code: string; name: string }>;
	selectedCountry: string;
	onChangeCountry: (countryCode: string) => void;
}

const CountrySelect = ({
	countries,
	selectedCountry,
	onChangeCountry,
}: Props) => {
	return (
		<div className="w-full max-w-md">
			<Label
				htmlFor="country-select"
				className="text-sm font-medium text-gray-700 mb-2 block"
			>
				<Globe className="w-4 h-4 inline mr-2" />
				Select Country
			</Label>
			<Select value={selectedCountry} onValueChange={onChangeCountry}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Choose a country..." />
				</SelectTrigger>
				<SelectContent>
					{countries.map((country) => (
						<SelectItem key={country.code} value={country.code}>
							{country.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CountrySelect;
