import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  parceiroId!: string;

  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  @Min(0)
  preco!: number;
}
