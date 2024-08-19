import React, { useCallback, useMemo } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";

import { DisplayEmailsData, EmailActionTypes } from "../types";
import { DeleteIcon } from "@chakra-ui/icons";
import EmailRow from "./shared/EmailRow";

type DisplayRecipientsProps = {
  domainEmails: DisplayEmailsData[];
  removeDomain: (domainName: string, action: EmailActionTypes) => void;
  toggleEmail: (domainName: string, id: number) => void;
  allowEditing: boolean;
};

export default function DisplayRecipients({
  domainEmails,
  removeDomain,
  toggleEmail,
}: DisplayRecipientsProps) {
  const onClickEmail = useCallback(
    (domainName: string, id: number) => {
      toggleEmail(domainName, id);
    },
    [toggleEmail]
  );

  const emailsWithDomain = useMemo(
    () => domainEmails.filter((d) => d.hasDomain),
    [domainEmails]
  );
  const emailsWithoutDomain = useMemo(
    () =>
      domainEmails
        .filter((d) => !d.hasDomain)
        .flatMap((domain) => domain.emails),
    [domainEmails]
  );

  return (
    <>
      <Accordion allowMultiple reduceMotion>
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Box as="span" flex="1" textAlign="left">
              Company recipients
            </Box>
          </AccordionButton>
          <AccordionPanel display="block" pl={0} pr={0}>
            <Accordion allowMultiple reduceMotion>
              {emailsWithDomain.map((domain) => {
                const allDomainEmailsAreNotSelected = domain.emails.some(
                  (email) => email.isSelected
                );

                return (
                  Boolean(allDomainEmailsAreNotSelected) && (
                    <AccordionItem key={domain.domainName} p={0}>
                      <Button
                        height={6}
                        className="domain-button"
                        aria-label={`Remove ${domain.domainName}`}
                        title={`Remove ${domain.domainName}`}
                        onClick={() =>
                          removeDomain(
                            domain.domainName,
                            EmailActionTypes.REMOVE
                          )
                        }
                      >
                        <>
                          <DeleteIcon fontSize={10} mr={2} />
                          <Box fontSize={12}>Remove</Box>
                        </>
                      </Button>
                      <AccordionButton>
                        <AccordionIcon ml={4} mr={1} />
                        <Box textAlign="left" fontWeight={600}>
                          {domain.domainName}
                        </Box>
                      </AccordionButton>
                      <AccordionPanel pb={4} pl={0} pr={0}>
                        <Accordion allowMultiple reduceMotion>
                          {domain.emails.map((email) => {
                            return email.isSelected ? (
                              <AccordionItem key={email.id}>
                                <EmailRow
                                  title={email.emailName}
                                  action={EmailActionTypes.REMOVE}
                                  onClick={() =>
                                    onClickEmail(domain.domainName, email.id)
                                  }
                                />
                              </AccordionItem>
                            ) : null;
                          })}
                        </Accordion>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                );
              })}
            </Accordion>
          </AccordionPanel>
        </AccordionItem>
        <Divider orientation="horizontal" mb={0} />
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Box as="span" flex="1" textAlign="left">
              Email recipients
            </Box>
          </AccordionButton>
          <AccordionPanel display="block" pl={0}>
            {emailsWithoutDomain.map((email) => {
              return email.isSelected ? (
                <AccordionItem key={email.id}>
                  <EmailRow
                    title={email.emailName}
                    action={EmailActionTypes.REMOVE}
                    onClick={() =>
                      onClickEmail(email.emailName.split("@")[1], email.id)
                    }
                  />
                </AccordionItem>
              ) : null;
            })}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
