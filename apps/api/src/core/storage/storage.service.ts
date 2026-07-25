import { Inject, Injectable } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { SUPABASE_ADMIN_CLIENT } from "../supabase/supabase.module";

export type StorageBucket = "checkin-photos" | "evolucao-fotos" | "exames";

@Injectable()
export class StorageService {
  constructor(@Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient) {}

  async createSignedUploadUrl(bucket: StorageBucket, extension: string) {
    const path = `${randomUUID()}.${extension.replace(/^\./, "")}`;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw new Error(`Falha ao gerar URL de upload: ${error?.message}`);
    }

    return { path, signedUrl: data.signedUrl, token: data.token };
  }

  async createSignedDownloadUrl(bucket: StorageBucket, path: string, expiresInSeconds = 3600) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data) {
      throw new Error(`Falha ao gerar URL de download: ${error?.message}`);
    }

    return data.signedUrl;
  }
}
