export interface FormField {
	key: string;
	label: string;
	component: "text" | "select";
	required: boolean;
	options: string[];
	placeholder?: string;
}

export interface FormConfig {
	countryCode: string;
	config: FormField[];
}

export interface Place {
	id: string;
	displayName: {
		languageCode: string;
		text: string;
	};
	formattedAddress: string;
}
