import { IsNotEmpty, IsString } from "class-validator";

export class RegisterProfessorDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;
}
