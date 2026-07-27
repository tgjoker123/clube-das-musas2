import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateConfiguracaoDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentualMarketplace?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentualPlataforma?: number;
}
