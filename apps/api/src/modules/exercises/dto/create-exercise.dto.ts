import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  grupoMuscular!: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  instrucoes?: string;
}
