"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRoleGuard } from "@/components/use-role-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { estado, isAdmin } = useRoleGuard("professor");

  useEffect(() => {
    if (estado === "liberado" && !isAdmin) {
      router.replace("/professor/dashboard");
    }
  }, [estado, isAdmin, router]);

  if (estado === "verificando" || !isAdmin) return null;

  return <>{children}</>;
}
