import React, { useCallback, useState } from "react";
import { Card, CardHeader, Heading } from "@chakra-ui/react";
import { groupEmailsByDomain } from "../helpers";

import { DisplayEmailsData, EmailActionTypes } from "../types";
import SelectRecipients from "./SelectRecipients";
import DisplayRecipients from "./DisplayRecipients";

const emailsJSON = require("../assets/recipientsData.json");

const App = () => {
  const [emails, setEmails] = useState<DisplayEmailsData[]>(
    groupEmailsByDomain(emailsJSON) || []
  );

  const selectDomain = useCallback(
    (domainName: string, action: EmailActionTypes) => {
      setEmails((prevEmails) =>
        prevEmails.map((domain) => {
          if (domain.domainName === domainName) {
            return {
              ...domain,
              emails: domain.emails.map((email) => ({
                ...email,
                isSelected: action === EmailActionTypes.ADD ? true : false,
              })),
            };
          }
          return domain;
        })
      );
    },
    [setEmails]
  );

  const toggleEmail = useCallback(
    (domainName: string, id: number) => {
      setEmails((prevEmails) =>
        prevEmails.map((domain) => {
          if (domain.domainName === domainName) {
            return {
              ...domain,
              emails: domain.emails.map((email) => {
                if (email.id === id) {
                  return {
                    ...email,
                    isSelected: !email.isSelected,
                  };
                }
                return email;
              }),
            };
          }
          return domain;
        })
      );
    },
    [setEmails]
  );

  const addNewRecipient = useCallback(
    (emailName: string) => {
      setEmails((prevEmails) => {
        const domainName = emailName.split("@")[1];

        let maxId = Math.floor(
          Math.max(
            ...prevEmails.flatMap((domain) =>
              domain.emails.map((email) => email.id)
            ),
            0
          )
        );

        const domainIndex = prevEmails.findIndex(
          (d) => d.domainName === domainName
        );

        // domain exists
        if (domainIndex !== -1) {
          const existingDomain = prevEmails[domainIndex];
          const updatedDomain = {
            ...existingDomain,
            hasDomain: existingDomain.emails.length > 0,
            emails: [
              ...existingDomain.emails,
              {
                id: ++maxId,
                emailName: emailName,
                isSelected: false,
              },
            ],
          };

          return [
            ...prevEmails.slice(0, domainIndex),
            updatedDomain,
            ...prevEmails.slice(domainIndex + 1),
          ];
        } else {
          const newDomain = {
            domainName: domainName,
            hasDomain: false, // only 1 email in the domain
            emails: [
              {
                id: ++maxId,
                emailName: emailName,
                isSelected: false,
              },
            ],
          };

          return [...prevEmails, newDomain];
        }
      });
    },
    [setEmails]
  );

  return (
    <main>
      <section className="container">
        <Card className="container__element">
          <CardHeader>
            <Heading fontWeight={500} fontSize={24}>
              Available recipients
            </Heading>
          </CardHeader>
          <SelectRecipients
            domainEmails={emails}
            selectDomain={selectDomain}
            toggleEmail={toggleEmail}
            addNewRecipient={addNewRecipient}
          />
        </Card>
        <Card className="container__element">
          <CardHeader>
            <Heading fontWeight={500} fontSize={24}>
              Selected recipients
            </Heading>
          </CardHeader>
          <DisplayRecipients
            domainEmails={emails}
            removeDomain={selectDomain}
            toggleEmail={toggleEmail}
            allowEditing={true}
          />
        </Card>
      </section>
    </main>
  );
};

export default App;
