const FIRST_DIGIT_FACTOR = 10;
const SECOND_DIGIT_FACTOR = 11;

export function validateCpf(cpf: string) {
	if (!cpf) return false;
	cpf = removeNonDigits(cpf);
	if (isInvalidLength(cpf)) return false;
	if (allDigitsAreTheSame(cpf)) return false;
	const digito1 = calculateDigit(cpf, FIRST_DIGIT_FACTOR);
	const digito2 = calculateDigit(cpf, SECOND_DIGIT_FACTOR);
	return `${digito1}${digito2}` === extractDigit(cpf);
}

function removeNonDigits(cpf: string) {
	return cpf.replace(/\D/g, "")
}

function isInvalidLength(cpf: string) {
	return cpf.length !== 11;
}

function allDigitsAreTheSame(cpf: string) {
	const [firstDigit] = cpf;
	return [...cpf].every(c => c === firstDigit)
}

function calculateDigit(cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const remainder = total % 11;
	return (remainder > 2) ? 0 : 11 - remainder;
}

function extractDigit(cpf: string) {
	return cpf.substring(9)
}
