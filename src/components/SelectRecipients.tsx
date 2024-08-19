import React, { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { DisplayEmailsData, EmailActionTypes } from "../types";
import { AddIcon } from "@chakra-ui/icons";
import EmailRow from "./shared/EmailRow";
import { filterDomainsByEmail, isValidEmail } from "../helpers";

type SelectRecipientsProps = {
  domainEmails: DisplayEmailsData[];
  selectDomain: (domainName: string, action: EmailActionTypes) => void;
  toggleEmail: (domainName: string, id: number) => void;
  addNewRecipient: (emailName: string) => void;
};

export default function SelectRecipients({
  domainEmails,
  selectDomain,
  toggleEmail,
  addNewRecipient,
}: SelectRecipientsProps) {
  const [search, setSearch] = useState<string>("");
  const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsInvalidEmail(false);
      setSearch(e.target.value);
    },
    [setSearch]
  );

  const onClickEmail = useCallback(
    (domainName: string, id: number) => {
      toggleEmail(domainName, id);
    },
    [toggleEmail]
  );

  const emailList = useMemo(
    () => domainEmails.flatMap((domain) => domain.emails),
    [domainEmails]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const emailExists = emailList.some((email) => email.emailName === search);
      const emailIsValid = isValidEmail(search);

      if (emailExists || !emailIsValid) {
        return setIsInvalidEmail(true);
      }

      addNewRecipient(search);
      setIsInvalidEmail(false);
      setSearch("");
    },
    [addNewRecipient, emailList, search]
  );

  const filteredSearchData = useMemo(
    () => filterDomainsByEmail(domainEmails, search),
    [domainEmails, search]
  );

  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl pl={5} pr={5} pb={5} isInvalid={isInvalidEmail}>
          <FormLabel
            title="Search Recipients or add new ones"
            htmlFor="search-variant"
          />
          <Input
            size="lg"
            variant="outline"
            id="search-variant"
            name="search-variant"
            placeholder="test@timescale.com"
            errorBorderColor="red.300"
            focusBorderColor={isInvalidEmail ? "red.300" : "blue.500"}
            isInvalid={isInvalidEmail}
            value={search}
            onChange={handleSearch}
          />
          {isInvalidEmail ? (
            <FormErrorMessage>Enter a valid email</FormErrorMessage>
          ) : (
            <FormHelperText>Search Recipients or add new ones</FormHelperText>
          )}
        </FormControl>
      </form>
      {filteredSearchData.map((domain) => {
        const allDomainEmailsAreNotSelected = domain.emails.some(
          (email) => !email.isSelected
        );

        return domain.hasDomain ? (
          Boolean(allDomainEmailsAreNotSelected) && (
            <Accordion
              key={domain.domainName}
              defaultIndex={[0]}
              allowMultiple
              reduceMotion
            >
              <AccordionItem>
                <Button
                  height={6}
                  className="domain-button"
                  aria-label="Select Domain"
                  title="Select Domain"
                  onClick={() =>
                    selectDomain(domain.domainName, EmailActionTypes.ADD)
                  }
                >
                  <>
                    <AddIcon fontSize={10} mr={2} />
                    <Box fontSize={12}>Add</Box>
                  </>
                </Button>
                <AccordionButton>
                  <AccordionIcon mr={2} />
                  <Box as="span" flex="1" textAlign="left" fontWeight={600}>
                    {domain.domainName}
                  </Box>
                </AccordionButton>
                {domain.emails.map((email) => {
                  return !email.isSelected ? (
                    <AccordionPanel key={email.id} p={0}>
                      <EmailRow
                        title={email.emailName}
                        action={EmailActionTypes.ADD}
                        onClick={() =>
                          onClickEmail(domain.domainName, email.id)
                        }
                      />
                    </AccordionPanel>
                  ) : null;
                })}
              </AccordionItem>
              <Divider orientation="horizontal" mb={0} />
            </Accordion>
          )
        ) : !domain?.emails[0]?.isSelected ? (
          <Box key={domain.domainName}>
            <EmailRow
              title={domain.emails[0].emailName}
              action={EmailActionTypes.ADD}
              onClick={() =>
                onClickEmail(domain.domainName, domain.emails[0].id)
              }
            />
          </Box>
        ) : null;
      })}
    </>
  );
}
