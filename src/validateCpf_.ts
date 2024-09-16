export function validateCpf(cpf: string) {
	if (cpf === null) return false;
	if (cpf === undefined) return false;
	cpf = cpf.replace('.', '').replace('.', '').replace('-', '').replace(" ", "");
	if (cpf.length !== 11) return false;
	const allDigitsAreTheSame = !cpf.split("").every(c => c === cpf[0])
	if (allDigitsAreTheSame) return false;
	let d1 = 0;
	let d2 = 0;
	for (let nCount = 1; nCount < cpf.length - 1; nCount++) {
		const digito = parseInt(cpf.substring(nCount - 1, nCount));
		d1 = d1 + (11 - nCount) * digito;
		d2 = d2 + (12 - nCount) * digito;
	};
	let rest = (d1 % 11);
	const dg1 = (rest < 2) ? 0 : 11 - rest;
	d2 += 2 * dg1;
	const dg2 = (rest < 2) ? 0 : 11 - rest;
	rest = (d2 % 11);
	let nDigVerific = cpf.substring(cpf.length - 2, cpf.length);
	const nDigResult = "" + dg1 + "" + dg2;
	return nDigVerific == nDigResult;
}
console.log(validateCpf("97456321558"));
console.log(validateCpf("12345678910"));
