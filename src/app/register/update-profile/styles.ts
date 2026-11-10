import { Box, styled, Text } from "@ignite-ui/react";

export const ProfileBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
  gap: "$4",

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
  },
});

export const PhotoField = styled("label", {
  "> span": {
    width: "$16",
    height: "$16",
    flexShrink: 0,

    borderRadius: "$full",
    overflow: "hidden",
  },

  "> span img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
export const FormAnnotation = styled(Text, {
  color: "$gray200",
});
