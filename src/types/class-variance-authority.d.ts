declare module "class-variance-authority" {
  export const cva: (...args: any[]) => any;
  export type VariantProps<T> = any;
}
declare module "class-variance-authority" {
  type ClassValue = string | number | boolean | null | undefined | ClassValue[] | { [key: string]: any };

  type CVAVariants = Record<string, Record<string, ClassValue>>;

  type CVAConfig<Variants extends CVAVariants> = {
    variants?: Variants;
    defaultVariants?: { [K in keyof Variants]?: keyof Variants[K] };
    compoundVariants?: Array<
      { [K in keyof Variants]?: keyof Variants[K] } & { class?: ClassValue; className?: ClassValue }
    >;
  };

  export type VariantProps<Component extends (...args: any) => any> = Component extends (
    props: infer P,
  ) => any
    ? Omit<P, "class" | "className">
    : never;

  export function cva<Variants extends CVAVariants = CVAVariants>(
    base?: ClassValue,
    config?: CVAConfig<Variants>,
  ): (props?: { [K in keyof Variants]?: keyof Variants[K] } & { class?: ClassValue; className?: ClassValue }) => string;
}
