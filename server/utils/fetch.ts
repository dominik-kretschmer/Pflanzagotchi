import type { H3Event } from "h3";

/**
 * Custom implementation of useRequestFetch for Nitro, as the Nuxt composable 
 * is not available in server handlers by default.
 * This ensures that cookies and other headers are forwarded to internal fetch calls.
 */
export function useRequestFetch(event: H3Event) {
  const headers = getProxyRequestHeaders(event);
  
  return (url: string, options?: any) => $fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers
    }
  });
}
