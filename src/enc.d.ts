export function encrypt(data: unknown, key: string): {
  part1: string;
  part2: string;
} | undefined;

export function decrypt(cipher: string, key: string): unknown;

export function generateSecreteKey(len: number): string;