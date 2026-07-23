import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ActivateStudentDto {
  @ApiProperty({ description: "Token de convite recebido do professor" })
  @IsString()
  @Length(10, 200)
  token!: string;
}
