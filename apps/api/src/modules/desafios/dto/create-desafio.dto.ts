import { IsIn, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDesafioDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsOptional()
  @IsIn(["treinos", "streak", "avaliacao"])
  metrica?: string;

  @IsISO8601()
  dataInicio!: string;

  @IsISO8601()
  dataFim!: string;
}
