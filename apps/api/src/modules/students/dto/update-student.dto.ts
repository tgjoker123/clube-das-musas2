import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StatusAluna } from "@musas/database";

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsISO8601()
  dataNascimento?: string;

  @IsOptional()
  @IsEnum(StatusAluna)
  status?: StatusAluna;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
