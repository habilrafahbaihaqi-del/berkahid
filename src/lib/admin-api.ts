"use client";

interface ApiError {
  error?: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    throw new Error(payload.error ?? `HTTP ${response.status}`);
  }
  return payload;
}

export interface AdminDoa {
  id: string;
  title: string;
  arabicText: string;
  translation: string;
  category: string;
}

export interface AdminZikr {
  id: string;
  name: string;
  arabicText: string;
  meaning: string;
  explanation: string;
  category: string;
}

export interface AdminStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categoryName: string;
}

export const adminDoaApi = {
  list: () => request<{ results: AdminDoa[] }>("/api/admin/doas"),
  create: (body: Omit<AdminDoa, "id">) =>
    request<{ result: AdminDoa }>("/api/admin/doas", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<Omit<AdminDoa, "id">>) =>
    request<{ result: AdminDoa }>(`/api/admin/doas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) => request<unknown>(`/api/admin/doas/${id}`, { method: "DELETE" }),
};

export const adminZikrApi = {
  list: () => request<{ results: AdminZikr[] }>("/api/admin/zikrs"),
  create: (body: Omit<AdminZikr, "id">) =>
    request<{ result: AdminZikr }>("/api/admin/zikrs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<Omit<AdminZikr, "id">>) =>
    request<{ result: AdminZikr }>(`/api/admin/zikrs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) => request<unknown>(`/api/admin/zikrs/${id}`, { method: "DELETE" }),
};

export const adminStoryApi = {
  list: () => request<{ results: AdminStory[] }>("/api/admin/stories"),
  create: (body: Omit<AdminStory, "id" | "categoryName">) =>
    request<{ result: AdminStory }>("/api/admin/stories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<Omit<AdminStory, "id" | "categoryName">>) =>
    request<{ result: AdminStory }>(`/api/admin/stories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) => request<unknown>(`/api/admin/stories/${id}`, { method: "DELETE" }),
};
