export async function fetchNui<T = any>(eventName: string, data?: any): Promise<T> {
  // ✅ DEV / przeglądarka — nie jesteśmy w NUI, więc nie robimy fetch do https://resource/...
  if (typeof (window as any).GetParentResourceName !== "function") {
    console.log(`[MOCK fetchNui] ${eventName}`, data ?? {});
    return {} as T;
  }

  const resourceName = (window as any).GetParentResourceName();

  const resp = await fetch(`https://${resourceName}/${eventName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data ?? {}),
  });

  try {
    return (await resp.json()) as T;
  } catch {
    return {} as T;
  }
}
