import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsIn(["ativo", "inativo"])
  status?: string;
}
