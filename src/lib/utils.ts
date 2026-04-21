import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCookies, deleteCookies, setCookies } from "@/cookies-action";
import { TokensResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AuthFetchResult =
  | { unauthorized: true; response: null }
  | { unauthorized: false; response: Response };

/**
 * A wrapper for fetch that automatically handles token refreshing.
 * Authorization: `bearer ${token}` by default
 * @param url - The endpoint to hit.
 * @param options - Standard RequestInit (headers, body, etc.).
 * @param isRetry - `(leaveIt default false)` Internal flag to prevent infinite loops on 401s.
 *
 * @returns A plain object containing the JSON data and status code.
 *          This structure is safe to pass from Server Components to Client Components.
 *
 */
export async function fetch_TokenHandler(
  url: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<AuthFetchResult> {
  const { token, refreshToken } = await getCookies();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    if (isRetry) {
      await deleteCookies(["token", "refreshToken"]);
      console.log("token expired");
      return { unauthorized: true, response: null }; // refreshToken is also invalid
    }

    const refreshResponse = await fetch(
      process.env.NEXT_PUBLIC_BASE_BACKEND_URL + "/api/Auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!refreshResponse.ok) {
      await deleteCookies(["token", "refreshToken"]);
      return { unauthorized: true, response: null }; // ✅ signal to caller
    }

    const { data }: { data: TokensResponse["data"] } =
      await refreshResponse.json();

    await setCookies([
      { name: "token", value: data.token, maxAge: data.expiresIn },
      {
        name: "refreshToken",
        value: data.refreshToken,
        expires: new Date(data.refreshTokenExpiration),
      },
    ]);

    // retry the original request with the new token
    return fetch_TokenHandler(url, options, true);
  }

  return { unauthorized: false, response };
}

/*That's why the approach I showed earlier is better — keep the entire sensitive operation on the server, return nothing sensitive:
Client component
      ↓ calls
Server action (logout) — reads cookie, calls API, deletes cookie
      ↓ returns nothing (or just ok/error)
Client component ← ✅ no token ever exposed
So the rule of thumb is:

✅ Call server actions from client components to perform sensitive operations
❌ Don't call server actions from client components to retrieve sensitive values and use them client-side
 */
