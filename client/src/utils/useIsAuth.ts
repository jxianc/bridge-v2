import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, router]);
};

export const useIsAuthForCreateComment = (postId: string) => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=/create-comment/" + postId);
    }
  }, [data, router]);
};
