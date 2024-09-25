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
		
		if (!accountId) {
			if (request.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
				if (request.email.match(/^(.+)@(.+)$/)) {
					if (validateCpf(request.cpf)) {
						if (request.isDriver) {
							if (request.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
								await databaseConnection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, request.name, request.email, request.cpf, request.carPlate, !!request.isPassenger, !!request.isDriver, request.password]);
								const response = {
									accountId: id
								};
								result = response;
							} else {
								result = -5;
							}
						} else {
							await databaseConnection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, request.name, request.email, request.cpf, request.carPlate, !!request.isPassenger, !!request.isDriver, request.password]);
							const response = {
								accountId: id
							};
							result = response;
						}
					} else {
						result = -1;
					}
				} else {
					result = -2;
				}
			} else {
				result = -3;
			}
		} else {
			result = -4;
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
