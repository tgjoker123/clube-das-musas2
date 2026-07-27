import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdatePlanoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @IsOptional()
  @IsIn(["mensal", "trimestral", "semestral", "anual"])
  periodicidade?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
