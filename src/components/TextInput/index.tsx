import { forwardRef, type InputHTMLAttributes } from "react";
import { styled } from "@stitches/react";

const TextInputContainer = styled("div", {
  backgroundColor: "$gray900",
  borderRadius: "$sm",
  boxSizing: "border-box",
  border: "2px solid $gray900",
  display: "flex",
  alignItems: "center",
  cursor: "text",

  variants: {
    size: {
      sm: {
        padding: "$2 $3",
      },
      md: {
        padding: "$3 $4",
      },
    },
  },

  "&:has(input:focus)": {
    borderColor: "$ignite300",
  },

  "&:has(input:disabled)": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  defaultVariants: {
    size: "md",
  },
});

const Prefix = styled("span", {
  fontFamily: "$default",
  fontSize: "$sm",
  color: "$gray400",
  fontWeight: "regular",
});

const Input = styled("input", {
  fontFamily: "$default",
  fontSize: "$sm",
  color: "$white",
  fontWeight: "regular",
  background: "transparent",
  border: 0,
  width: "100%",

  "&:focus": {
    outline: 0,
  },

  "&:disabled": {
    cursor: "not-allowed",
  },

  "&::placeholder": {
    color: "$gray500",
  },
});

interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  prefix?: string;
  size?: "sm" | "md";
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ prefix, size = "md", ...props }, ref) => {
    return (
      <TextInputContainer size={size}>
        {prefix && <Prefix>{prefix}</Prefix>}

        <Input ref={ref} {...props} />
      </TextInputContainer>
    );
  },
);

TextInput.displayName = "TextInput";
