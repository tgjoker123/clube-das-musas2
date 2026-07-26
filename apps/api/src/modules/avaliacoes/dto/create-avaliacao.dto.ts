import { IsInt, Max, Min } from "class-validator";

export class CreateAvaliacaoDto {
  @IsInt()
  @Min(1)
  @Max(4)
  nota!: number;
}
