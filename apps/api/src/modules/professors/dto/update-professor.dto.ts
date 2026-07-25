import { IsNumber, IsOptional, Min } from "class-validator";

export class UpdateProfessorDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMensalidade?: number;
}
