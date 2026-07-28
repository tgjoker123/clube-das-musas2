import { BadRequestException } from "@nestjs/common";

export function sanitizeCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) {
    throw new BadRequestException("CPF inválido");
  }
  return digits;
}
