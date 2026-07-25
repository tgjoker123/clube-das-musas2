import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  telefone!: string;

  @IsOptional()
  @IsString()
  mensagem?: string;
}
