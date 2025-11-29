export type TenantAwareSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: {
    id: string;
    email?: string;
    tenant_id?: string;
  };
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;

async function request(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing");
  }
  const headers = new Headers(init.headers);
  headers.set("apikey", SUPABASE_ANON_KEY);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response;
}

class SupabaseService {
  async signUp(email: string, password: string, tenantName: string): Promise<TenantAwareSession> {
    const res = await request(`/auth/v1/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, data: { tenant_name: tenantName } }),
    });
    return res.json();
  }

  async signIn(email: string, password: string): Promise<TenantAwareSession> {
    const res = await request(`/auth/v1/token?grant_type=password`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }

  async uploadDocument(bucket: string, path: string, file: File, token: string) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase environment variables are missing");
    }
    const uploadHeaders = new Headers({
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
    });

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method: "PUT",
      headers: uploadHeaders,
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${await res.text()}`);
    }

    return { path: `${bucket}/${path}` };
  }

  async callEdgeFunction<T>(name: string, payload: Record<string, unknown>, token: string) {
    const res = await fetch(`${SUPABASE_FUNCTION_URL}/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return (await res.json()) as T;
  }
}

export const supabaseClient = new SupabaseService();
