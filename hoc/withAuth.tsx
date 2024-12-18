import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../lib/firebase";

export default function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push("/auth/login");
        }
      });
      return () => unsubscribe();
    }, [router]);

    return <Component {...props} />;
  };
}
