import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateEvolucaoDto {
  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsObject()
  medidas?: Record<string, unknown>;
}
