declare module "@radix-ui/react-accordion" {
  import * as React from "react";

  type AccordionValue = string | string[];

  type AccordionProps = React.ComponentPropsWithoutRef<"div"> & {
    type?: "single" | "multiple";
    collapsible?: boolean;
    value?: AccordionValue;
    defaultValue?: AccordionValue;
    onValueChange?: (value: AccordionValue) => void;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    dir?: "ltr" | "rtl";
  };

  type AccordionItemProps = React.ComponentPropsWithoutRef<"div"> & {
    value: string;
    disabled?: boolean;
  };

  type AccordionHeaderProps = React.ComponentPropsWithoutRef<"h3">;
  type AccordionTriggerProps = React.ComponentPropsWithoutRef<"button">;
  type AccordionContentProps = React.ComponentPropsWithoutRef<"div">;

  const Root: React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>;
  const Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<HTMLDivElement>>;
  const Header: React.ForwardRefExoticComponent<AccordionHeaderProps & React.RefAttributes<HTMLHeadingElement>>;
  const Trigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  const Content: React.ForwardRefExoticComponent<AccordionContentProps & React.RefAttributes<HTMLDivElement>>;

  export { Root, Item, Header, Trigger, Content };
}
