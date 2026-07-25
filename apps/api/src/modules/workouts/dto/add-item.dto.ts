import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  exercicioId!: string;

  @IsInt()
  @Min(1)
  series!: number;

  @IsString()
  @IsNotEmpty()
  reps!: string;

  @IsOptional()
  @IsString()
  carga?: string;
}
