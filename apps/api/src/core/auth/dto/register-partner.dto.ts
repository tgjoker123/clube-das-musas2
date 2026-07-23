import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class RegisterPartnerDto {
  /** Normalmente já vem do metadata do Supabase Auth (signUp); serve como fallback. */
  @ApiProperty({
    required: false,
    description: "Nome completo — obrigatório apenas se ausente no cadastro do Supabase",
  })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  fullName?: string;

  @ApiProperty({ description: "Nome da marca/empresa parceira" })
  @IsString()
  @Length(2, 120)
  businessName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  category?: string;
}
