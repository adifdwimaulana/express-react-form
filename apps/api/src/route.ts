import express, { type Request, type Response } from "express";
import { Address, FormConfig, Validator } from "./schema";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

const router = express.Router();
const ajv = new Ajv2020({ strict: false });
addFormats(ajv);

router.get("/validators/:countryCode", async (req: Request, res: Response) => {
	const { countryCode } = req.params;

	const validator = await Validator.findOne({ countryCode });
	if (!validator) {
		return res.status(404).json({ message: "Validator not found" });
	}

	res.json({ data: validator });
});

router.get("/forms/:countryCode", async (req: Request, res: Response) => {
	const { countryCode } = req.params;

	const formConfig = await FormConfig.findOne({ countryCode });
	if (!formConfig) {
		return res.status(404).json({ message: "Form config not found" });
	}

	res.json({ data: formConfig });
});

router.post("/addresses", async (req: Request, res: Response) => {
	const { countryCode, data } = req.body;

	if (!countryCode || !data) {
		return res
			.status(400)
			.json({ message: "countryCode and data are required" });
	}

	const validator = await Validator.findOne({ countryCode });

	if (!validator) {
		return res.status(422).json({
			message: `No validator found for this country code: ${countryCode}`,
		});
	}

	const jsonSchemaValidation = ajv.compile(validator.jsonSchema);
	const isValid = jsonSchemaValidation(data);

	if (!isValid) {
		return res.status(422).json({
			message: "Validation failed",
			errors: jsonSchemaValidation.errors,
		});
	}

	const address = new Address({ countryCode, data });
	await address.save();

	res
		.status(201)
		.json({ message: "Address saved successfully", data: address });
});

export { router };
