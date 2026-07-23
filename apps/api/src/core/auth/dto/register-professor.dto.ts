import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, Length } from "class-validator";
import type { ThemeName } from "@musas/database";

export class RegisterProfessorDto {
  /** Normalmente já vem do metadata do Supabase Auth (signUp); serve como fallback. */
  @ApiProperty({
    required: false,
    description: "Nome completo — obrigatório apenas se ausente no cadastro do Supabase",
  })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  fullName?: string;

  @ApiProperty({ description: "Nome do negócio/marca exibido às alunas" })
  @IsString()
  @Length(2, 120)
  businessName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @ApiProperty({ enum: ["luxo", "elegance"], required: false, default: "luxo" })
  @IsOptional()
  @IsIn(["luxo", "elegance"])
  themePreference?: ThemeName;
}
