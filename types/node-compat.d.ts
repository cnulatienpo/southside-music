declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
  export function pathToFileURL(path: string): URL;
}

declare module "node:path" {
  export function resolve(...paths: string[]): string;
}
