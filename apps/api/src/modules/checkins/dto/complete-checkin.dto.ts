import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CompleteCheckInDto {
  @IsString()
  @IsNotEmpty()
  exercicioId!: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cargaUsada?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  repsUsadas?: number;
}
