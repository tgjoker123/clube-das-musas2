import { BadRequestException, Controller, Query, UseGuards, Get } from "@nestjs/common";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { StorageService, type StorageBucket } from "./storage.service";

const VALID_BUCKETS: StorageBucket[] = ["checkin-photos", "evolucao-fotos", "exames"];

@Controller("storage")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("upload-url")
  createUploadUrl(@Query("bucket") bucket: string, @Query("extension") extension: string) {
    if (!VALID_BUCKETS.includes(bucket as StorageBucket)) {
      throw new BadRequestException("Bucket inválido");
    }
    if (!extension) {
      throw new BadRequestException("Extensão do arquivo é obrigatória");
    }
    return this.storageService.createSignedUploadUrl(bucket as StorageBucket, extension);
  }
}
