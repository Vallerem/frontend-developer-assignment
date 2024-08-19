import { DisplayEmailsData, EmailData } from "../types";

export function groupEmailsByDomain(data: EmailData[]): DisplayEmailsData[] {
  const domainMap: {
    [domain: string]: { id: number; emailName: string; isSelected: boolean }[];
  } = {};

  data.forEach((item) => {
    const domainName = item.email.split("@");
    const domain = domainName.length > 1 ? domainName[1] : null;

    if (domain) {
      if (!domainMap[domain]) {
        domainMap[domain] = [];
      }

      domainMap[domain].push({
        id: item.id,
        emailName: item.email,
        isSelected: item.isSelected,
      });
    } else {
      domainMap[item.email] = [
        { id: item.id, emailName: item.email, isSelected: item.isSelected },
      ];
    }
  });

  const result: DisplayEmailsData[] = [];

  for (const domain in domainMap) {
    result.push({
      domainName: domain,
      hasDomain: domainMap[domain].length > 1, // more than 1 email with the same domain
      emails: domainMap[domain],
    });
  }

  return result;
}

export function filterDomainsByEmail(
  data: DisplayEmailsData[],
  searchInput: string
): DisplayEmailsData[] {
  return data
    .map((domain) => {
      const matchingEmails = domain.emails.filter((email) =>
        email.emailName.includes(searchInput)
      );

      if (matchingEmails.length > 0) {
        return {
          ...domain,
          emails: matchingEmails,
        };
      } else {
        return null;
      }
    })
    .filter((domain) => domain !== null);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
