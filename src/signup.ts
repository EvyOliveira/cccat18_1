import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const request = req.body;
	const databaseConnection = pgp()("postgres://postgres:123456@localhost:5432/app");

	try {
		const id = crypto.randomUUID();
		let result;
		const [accountId] = await databaseConnection.query("select * from ccca.account where email = $1", [request.email]);

		if (accountId) return result = -4;
		if (!request.name.match(/[a-zA-Z] [a-zA-Z]+/)) return result = -3;
		if (!request.email.match(/^(.+)@(.+)$/)) return result = -2;
		if (!validateCpf(request.cpf)) return result = -1;
		if (!request.carPlate.match(/[A-Z]{3}[0-9]{4}/)) return result = -5;
		if (request.isDriver) {
			await databaseConnection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, request.name, request.email, request.cpf, request.carPlate, !!request.isPassenger, !!request.isDriver, request.password]);
			const response = {
				accountId: id
			};
			result = response;
		} else {
			await databaseConnection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, request.name, request.email, request.cpf, request.carPlate, !!request.isPassenger, !!request.isDriver, request.password]);
			const response = {
				accountId: id
			};
			result = response;
		}
		if (typeof result === "number") {
			res.status(422).json({ message: result });
		} else {
			res.json(result);
		}
	} finally {
		await databaseConnection.$pool.end();
	}
});

app.listen(3000);
