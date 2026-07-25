import { IsObject } from "class-validator";

export class CreateAnamneseDto {
  @IsObject()
  respostas!: Record<string, unknown>;
}
