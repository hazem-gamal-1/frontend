"use client";
import { deleteCookies, getCookies } from "@/cookies-action";
import { fetch_TokenHandler } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useRouter } from "next/navigation";

export default function LogOutBtn() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const logout = async () => {
    const { refreshToken } = await getCookies();
    try {
      setIsPending(true);
      const { unauthorized, response } = await fetch_TokenHandler(
        process.env.NEXT_PUBLIC_BASE_BACKEND_URL +
          "/api/Auth/revoke-refresh-token",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (unauthorized) router.push("/auth/sign-in");

      if (!response) return;

      const result = await response.json();

      if (response.ok) {
        await deleteCookies(["token", "refreshToken"]);
        router.push("/auth/sign-in");
      } else {
        throw new Error(result.data.error ?? "Something went wrong");
      }
    } catch (err) {
      if (err instanceof Error && !isRedirectError(err)) {
        toast.error(err.message);
      }
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          disabled={isPending}
          className="bg-red-700  hover:bg-red-700/80 active:scale-97 transition duration-200"
          onClick={logout}
        >
          <div className="font-medium w-full flex gap-2 justify-center items-center">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              <>
                <LogOut className={"size-4"} />
                <span>Sign out</span>
              </>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
