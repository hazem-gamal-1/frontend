"use server";

import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";

export const setCookies = async (cookieList: ResponseCookie[]) => {
  const cookieStore = await cookies();
  cookieList.forEach((cookie) => {
    cookieStore.set({
      ...cookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  });
};

export const deleteCookies = async (cookieNameList: string[]) => {
  const cookieStore = await cookies();
  cookieNameList.forEach((element) => {
    cookieStore.delete(element);
  });
};

export const getCookies = async () => {
  const cookieStore = await cookies();
  return {
    refreshToken: cookieStore.get("refreshToken")?.value,
    token: cookieStore.get("token")?.value,
  };
};
