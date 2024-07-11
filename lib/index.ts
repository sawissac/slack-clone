export function isMobileView() {
  if (typeof window === "undefined") return false;
  const useAgent = window.navigator.userAgent;
  return /Mobi/.test(useAgent);
}
