import { IsNotEmpty, IsString } from "class-validator";

export class AssociateAlunaDto {
  @IsString()
  @IsNotEmpty()
  alunaId!: string;
}
