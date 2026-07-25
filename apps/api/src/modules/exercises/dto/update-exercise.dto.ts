import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  grupoMuscular?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  instrucoes?: string;
}
