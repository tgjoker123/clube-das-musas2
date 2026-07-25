import { IsNotEmpty, IsString } from "class-validator";

export class CreateFichaDto {
  @IsString()
  @IsNotEmpty()
  nomeTemplate!: string;
}
