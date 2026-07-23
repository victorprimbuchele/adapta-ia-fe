import { useEffect, useState } from "react";
import { apiClient } from "../../../infra/http/apiClient";

// `<audio src>`/`<a href>` não enviam o header Authorization, então o
// binário precisa ser buscado via Axios (que já anexa o Bearer token) e
// convertido em Blob URL (docs/API.md §6.8).
export function useAuthenticatedFileUrl(fileId: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(Boolean(fileId));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setUrl(null);
      setIsPending(false);
      setIsError(false);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    setIsPending(true);
    setIsError(false);

    apiClient
      .get(`/arquivos/${fileId}`, { responseType: "blob" })
      .then((response) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data as Blob);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsPending(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  return { url, isPending, isError };
}
