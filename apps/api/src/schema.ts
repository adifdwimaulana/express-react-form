import { model, Schema } from "mongoose";

const AddressSchema = new Schema({
	countryCode: { type: String, required: true },
	data: { type: Schema.Types.Mixed, required: true },
});

const ValidatorSchema = new Schema({
	countryCode: { type: String, required: true, unique: true },
	jsonSchema: { type: Schema.Types.Mixed, required: true },
});

const FormFieldSchema = new Schema(
	{
		key: { type: String, required: true },
		label: { type: String, required: true },
		component: { type: String, required: true },
		required: { type: Boolean, default: false },
		placeholder: { type: String },
		options: [{ type: String }],
		maxLength: { type: Number },
	},
	{ _id: false },
);

const FormConfigSchema = new Schema({
	countryCode: { type: String, required: true, unique: true },
	config: { type: [FormFieldSchema], required: true },
});

const Address = model("Address", AddressSchema);
const Validator = model("Validator", ValidatorSchema);
const FormConfig = model("FormConfig", FormConfigSchema);

export { Address, Validator, FormConfig, seedingFormConfig, seedingValidator };

/**
 * Seeding initial data for config
 */
async function seedingFormConfig() {
	// const
	const usaFormConfig = await FormConfig.findOne({ countryCode: "USA" });
	const ausFormConfig = await FormConfig.findOne({ countryCode: "AUS" });
	const idnFormConfig = await FormConfig.findOne({ countryCode: "IDN" });

	if (!usaFormConfig) {
		const usaFormFieldSchema = [
			{
				key: "addressLine1",
				label: "Address Line 1",
				component: "text",
				required: true,
				placeholder: "123 Main St",
				maxLength: 5,
			},
			{
				key: "addressLine2",
				label: "Address Line 2",
				component: "text",
				required: false,
			},
			{
				key: "city",
				label: "City",
				component: "text",
				required: true,
				placeholder: "Los Angeles",
			},
			{
				key: "state",
				label: "State",
				component: "select",
				required: true,
				options: ["CA", "NY", "TX"],
				placeholder: "Select State",
			},
			{
				key: "zipCode",
				label: "ZIP Code",
				component: "text",
				required: true,
				placeholder: "12345",
			},
		];

		await FormConfig.create({
			countryCode: "USA",
			config: usaFormFieldSchema,
		});
	}

	if (!ausFormConfig) {
		const ausFormFieldSchema = [
			{
				key: "addressLine1",
				label: "Address Line 1",
				component: "text",
				required: true,
				placeholder: "123 Main St",
			},
			{
				key: "addressLine2",
				label: "Address Line 2",
				component: "text",
				required: false,
			},
			{
				key: "suburb",
				label: "Suburb",
				component: "text",
				required: true,
				placeholder: "Sydney",
			},
			{
				key: "state",
				label: "State",
				component: "select",
				required: true,
				options: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
				placeholder: "Select State",
			},
			{
				key: "postcode",
				label: "Postcode",
				component: "text",
				required: true,
				placeholder: "2000",
				maxLength: 4,
			},
		];

		await FormConfig.create({
			countryCode: "AUS",
			config: ausFormFieldSchema,
		});
	}

	if (!idnFormConfig) {
		const idnFormFieldSchema = [
			{
				key: "province",
				label: "Province",
				component: "select",
				required: true,
				options: ["Jawa Barat", "Bali", "Sumatra Utara"],
				placeholder: "Select Province",
			},
			{
				key: "city",
				label: "City",
				component: "text",
				required: true,
				placeholder: "Bandung",
			},
			{
				key: "district",
				label: "District",
				component: "text",
				required: true,
				placeholder: "Bojongsoang",
			},
			{
				key: "village",
				label: "Village",
				component: "text",
				required: false,
				placeholder: "Cibiru",
			},
			{
				key: "postalCode",
				label: "Postal Code",
				component: "text",
				required: true,
				placeholder: "12345",
				maxLength: 5,
			},
			{
				key: "streetAddress",
				label: "Street Address",
				component: "textarea",
				required: true,
				placeholder: "Jalan Raya No.123",
			},
		];

		await FormConfig.create({
			countryCode: "IDN",
			config: idnFormFieldSchema,
		});
	}
}

async function seedingValidator() {
	const usaValidator = await Validator.findOne({ countryCode: "USA" });
	const ausValidator = await Validator.findOne({ countryCode: "AUS" });
	const idnValidator = await Validator.findOne({ countryCode: "IDN" });

	if (!usaValidator) {
		const jsonSchemaValidator = {
			$schema: "https://json-schema.org/draft/2020-12/schema",
			type: "object",
			anyOf: [
				{
					properties: {
						id: { type: "string" },
						formattedAddress: { type: "string" },
						displayName: { type: "object" },
					},
					required: ["id", "formattedAddress", "displayName"],
					additionalProperties: false,
				},
				{
					properties: {
						addressLine1: { type: "string", minLength: 1 },
						addressLine2: { type: "string" },
						city: { type: "string", minLength: 1 },
						state: {
							type: "string",
							enum: ["CA", "NY", "TX"],
						},
						zipCode: { type: "string", pattern: "^[0-9]{5}$" },
					},
					required: ["addressLine1", "city", "state", "zipCode"],
					additionalProperties: false,
				},
			],
		};

		await Validator.create({
			countryCode: "USA",
			jsonSchema: jsonSchemaValidator,
		});
	}

	if (!ausValidator) {
		const jsonSchemaValidator = {
			$schema: "https://json-schema.org/draft/2020-12/schema",
			type: "object",
			anyOf: [
				{
					properties: {
						id: { type: "string" },
						formattedAddress: { type: "string" },
						displayName: { type: "object" },
					},
					required: ["id", "formattedAddress", "displayName"],
					additionalProperties: false,
				},
				{
					properties: {
						addressLine1: { type: "string", minLength: 1 },
						addressLine2: { type: "string" },
						suburb: { type: "string", minLength: 1 },
						state: {
							type: "string",
							enum: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
						},
						postcode: { type: "string", pattern: "^[0-9]{4}$" },
					},
					required: ["addressLine1", "suburb", "state", "postcode"],
					additionalProperties: false,
				},
			],
		};

		await Validator.create({
			countryCode: "AUS",
			jsonSchema: jsonSchemaValidator,
		});
	}

	if (!idnValidator) {
		const jsonSchemaValidator = {
			$schema: "https://json-schema.org/draft/2020-12/schema",
			type: "object",
			anyOf: [
				{
					properties: {
						id: { type: "string" },
						formattedAddress: { type: "string" },
						displayName: { type: "object" },
					},
					required: ["id", "formattedAddress", "displayName"],
					additionalProperties: false,
				},
				{
					properties: {
						province: { type: "string" },
						city: { type: "string" },
						district: { type: "string" },
						village: { type: "string" },
						postalCode: { type: "string", pattern: "^[0-9]{5}$" },
						streetAddress: { type: "string" },
					},
					required: [
						"province",
						"city",
						"district",
						"postalCode",
						"streetAddress",
					],
					additionalProperties: false,
				},
			],
		};

		await Validator.create({
			countryCode: "IDN",
			jsonSchema: jsonSchemaValidator,
		});
	}
}
