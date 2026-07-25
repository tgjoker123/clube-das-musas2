import { IsNotEmpty, IsString } from "class-validator";

export class CompleteCheckInDto {
  @IsString()
  @IsNotEmpty()
  exercicioId!: string;

  @IsString()
  @IsNotEmpty()
  fotoUrl!: string;
}
