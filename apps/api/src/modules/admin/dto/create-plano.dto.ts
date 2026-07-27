import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @Min(0)
  valor!: number;

  @IsOptional()
  @IsIn(["mensal", "trimestral", "semestral", "anual"])
  periodicidade?: string;
}
