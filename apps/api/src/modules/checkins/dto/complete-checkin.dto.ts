import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CompleteCheckInDto {
  @IsString()
  @IsNotEmpty()
  exercicioId!: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
