import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  mensagem!: string;

  @IsOptional()
  @IsString()
  alunaId?: string;
}
