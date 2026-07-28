import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateProfessorAdminDto {
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentualComissao?: number;

  @IsOptional()
  @IsIn(["ativo", "suspenso"])
  status?: string;
}
