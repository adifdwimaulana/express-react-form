db = db.getSiblingDB("frankie-db");

db.createUser({
	user: "application",
	pwd: "application",
	roles: [
		{
			role: "readWrite",
			db: "frankie-db",
		},
	],
});
