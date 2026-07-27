import { IsEmail, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsISO8601()
  dataNascimento!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
