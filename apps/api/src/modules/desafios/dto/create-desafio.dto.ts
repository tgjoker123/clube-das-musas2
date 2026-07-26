import { IsISO8601, IsNotEmpty, IsString } from "class-validator";

export class CreateDesafioDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsISO8601()
  dataInicio!: string;

  @IsISO8601()
  dataFim!: string;
}
