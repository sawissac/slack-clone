import { SupabaseMessageResponse } from "./Store";

export function isMobileView() {
  if (typeof window === "undefined") return false;
  const useAgent = window.navigator.userAgent;
  return /Mobi/.test(useAgent);
}

export function parseEmail(email: string | null) {
  if (!email) return "";
  let parsedAtSign = email.split("@")?.at(0);
  let parsePlusSign = parsedAtSign?.split("+");
  let parsedPlusSign = parsePlusSign?.at(0);
  return parsedPlusSign;
}

export function getUnDuplicateAuthor(messages: SupabaseMessageResponse[]) {
  return Array.from(new Set(messages.map((ls) => ls.author.username)));
}
