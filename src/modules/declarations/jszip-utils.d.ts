declare module 'jszip-utils' {
  export function getBinaryContent(
    url: string,
    callback: (error: Error | null, data: ArrayBuffer | null) => void
  ): void;
}
