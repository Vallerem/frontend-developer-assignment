import { Box } from "@chakra-ui/react";
import { EmailActionTypes } from "../../types";

type EmailRowProps = {
  title: string;
  action: EmailActionTypes;
  onClick: () => void;
};

const ActionIconOptions = {
  [EmailActionTypes.ADD]: {
    title: "Select",
    ariaLabel: "Select",
  },
  [EmailActionTypes.REMOVE]: {
    title: "Remove",
    ariaLabel: "Remove",
  },
};

export default function EmailRow({ title, action, onClick }: EmailRowProps) {
  return (
    <>
      <Box
        as="button"
        pl={12}
        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
        fontSize="14px"
        bg="#fff"
        _hover={{ bg: "#EDF2F7" }}
        _focus={{
          boxShadow:
            "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
        }}
        aria-label={`${ActionIconOptions[action]?.ariaLabel} ${title}`}
        title={`${ActionIconOptions[action]?.title} ${title}`}
        className="email-action-button"
        onClick={onClick}
      >
        {title}
      </Box>
    </>
  );
}
