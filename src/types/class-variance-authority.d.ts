declare module "class-variance-authority" {
  export const cva: (...args: unknown[]) => unknown;
  export type VariantProps<T> = unknown;
}
declare module "class-variance-authority" {
  type ClassValue = string | number | boolean | null | undefined | ClassValue[] | { [key: string]: unknown };

  type CVAVariants = Record<string, Record<string, ClassValue>>;

  type CVAConfig<Variants extends CVAVariants> = {
    variants?: Variants;
    defaultVariants?: { [K in keyof Variants]?: keyof Variants[K] };
    compoundVariants?: Array<
      { [K in keyof Variants]?: keyof Variants[K] } & { class?: ClassValue; className?: ClassValue }
    >;
  };

  export type VariantProps<Component extends (...args: unknown[]) => unknown> = Component extends (
    props: infer P,
  ) => unknown
    ? Omit<P, "class" | "className">
    : never;

  export function cva<Variants extends CVAVariants = CVAVariants>(
    base?: ClassValue,
    config?: CVAConfig<Variants>,
  ): (props?: { [K in keyof Variants]?: keyof Variants[K] } & { class?: ClassValue; className?: ClassValue }) => string;
}
