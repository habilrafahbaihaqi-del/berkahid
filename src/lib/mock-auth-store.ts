"use client";

import { createStoredValue, useStoredValue } from "@/lib/storage";

export interface MockUser {
  email: string;
  password: string;
  verified: boolean;
}

export interface MockSession {
  email: string;
}

export type SignInResult =
  | { ok: true }
  | { ok: false; error: "not-found" | "not-verified" | "wrong-password" };

const USERS_KEY = "berkahid:mock-users";
const SESSION_KEY = "berkahid:mock-session";

const sessionStore = createStoredValue<MockSession>(SESSION_KEY);

function readUsers(): Record<string, MockUser> {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, MockUser>) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, MockUser>) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage tidak tersedia — abaikan
  }
}

export function mockSignUp(email: string, password: string) {
  const users = readUsers();
  users[email.toLowerCase()] = {
    email: email.toLowerCase(),
    password,
    verified: false,
  };
  writeUsers(users);
}

export function mockVerify(email: string) {
  const users = readUsers();
  const user = users[email.toLowerCase()];
  if (user) {
    user.verified = true;
    writeUsers(users);
  }
}

export const DEMO_EMAIL = "demo@berkahid.app";
export const DEMO_PASSWORD = "berkahid123";

export function ensureDemoAccount() {
  const users = readUsers();
  const email = DEMO_EMAIL;
  if (!users[email]) {
    users[email] = { email, password: DEMO_PASSWORD, verified: true };
    writeUsers(users);
  }
}

export function mockSignIn(email: string, password: string): SignInResult {
  const users = readUsers();
  const user = users[email.toLowerCase()];
  if (!user) return { ok: false, error: "not-found" };
  if (!user.verified) return { ok: false, error: "not-verified" };
  if (user.password !== password) return { ok: false, error: "wrong-password" };
  sessionStore.set({ email: user.email });
  return { ok: true };
}

export type ResetPasswordResult =
  | { ok: true }
  | { ok: false; error: "not-found" | "not-verified" };

export function mockResetPassword(
  email: string,
  newPassword: string,
): ResetPasswordResult {
  const users = readUsers();
  const user = users[email.toLowerCase()];
  if (!user) return { ok: false, error: "not-found" };
  if (!user.verified) return { ok: false, error: "not-verified" };
  user.password = newPassword;
  writeUsers(users);
  return { ok: true };
}

export function mockSignOut() {
  sessionStore.set(null);
}

export function useMockSession() {
  return useStoredValue(sessionStore);
}
