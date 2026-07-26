import { createClient } from "./supabase/client";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

const REFRESH_MARGIN_SECONDS = 60;

async function getValidSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const expiresInSeconds = (session.expires_at ?? 0) - Math.floor(Date.now() / 1000);
  if (expiresInSeconds > REFRESH_MARGIN_SECONDS) return session;

  // Token já expirado ou perto de expirar (ex: aba ficou em segundo plano
  // e o timer de auto-refresh do SDK não disparou) — renova explicitamente
  // em vez de deixar a API rejeitar com 401 e forçar login de novo.
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) return session;
  return data.session;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = await getValidSession();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export async function uploadFile(
  bucket: "checkin-photos" | "evolucao-fotos" | "exames" | "aluna-fotos",
  file: File,
): Promise<string> {
  const extension = file.name.split(".").pop() ?? "bin";
  const { path, signedUrl, token } = await api.get<{
    path: string;
    signedUrl: string;
    token: string;
  }>(`/storage/upload-url?bucket=${bucket}&extension=${extension}`);

  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
  if (error) throw error;

  void signedUrl;
  return path;
}

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";

export async function uploadAlunaFoto(file: File): Promise<string> {
  const path = await uploadFile("aluna-fotos", file);
  return `${SUPABASE_URL}/storage/v1/object/public/aluna-fotos/${path}`;
}
