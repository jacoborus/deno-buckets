export interface BundlerOptions {
  entry: string;
  folders: string[];
  output?: string;
  key: string;
}
export type FileTree = Record<string, string>;
