import { IsISO8601, IsNotEmpty, IsString } from "class-validator";

export class CreateExameDto {
  @IsString()
  @IsNotEmpty()
  arquivoUrl!: string;

  @IsISO8601()
  dataExame!: string;
}
