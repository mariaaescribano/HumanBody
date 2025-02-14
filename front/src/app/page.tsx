'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al usuario a /inicio/main
    router.push("/login/login");
  }, [router]);

  return null;
}
