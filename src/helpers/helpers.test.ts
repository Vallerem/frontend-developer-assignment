import {
  groupEmailsByDomain,
  filterDomainsByEmail,
  isValidEmail,
} from "./index";
import { DisplayEmailsData, EmailData } from "../types";

describe("groupEmailsByDomain", () => {
  it("should group emails by domain", () => {
    const emails: EmailData[] = [
      { id: 1, email: "johnny@example.com", isSelected: true },
      { id: 2, email: "jan@example.com", isSelected: false },
      { id: 3, email: "test@test.com", isSelected: true },
    ];

    const expected: DisplayEmailsData[] = [
      {
        domainName: "example.com",
        hasDomain: true,
        emails: [
          { id: 1, emailName: "johnny@example.com", isSelected: true },
          { id: 2, emailName: "jan@example.com", isSelected: false },
        ],
      },
      {
        domainName: "test.com",
        hasDomain: false,
        emails: [{ id: 3, emailName: "test@test.com", isSelected: true }],
      },
    ];

    expect(groupEmailsByDomain(emails)).toEqual(expected);
  });

  it("should handle emails without a domain", () => {
    const emails: EmailData[] = [
      { id: 1, email: "invalid_name", isSelected: false },
      { id: 2, email: "johnny@example.com", isSelected: true },
    ];

    const expected: DisplayEmailsData[] = [
      {
        domainName: "invalid_name",
        hasDomain: false,
        emails: [{ id: 1, emailName: "invalid_name", isSelected: false }],
      },
      {
        domainName: "example.com",
        hasDomain: false,
        emails: [{ id: 2, emailName: "johnny@example.com", isSelected: true }],
      },
    ];

    expect(groupEmailsByDomain(emails)).toEqual(expected);
  });

  it("should return an empty array when given no emails", () => {
    const emails: EmailData[] = [];
    const expected: DisplayEmailsData[] = [];
    expect(groupEmailsByDomain(emails)).toEqual(expected);
  });
});

describe("filterDomainsByEmail", () => {
  it("should filter emails by search input", () => {
    const data: DisplayEmailsData[] = [
      {
        domainName: "example.com",
        hasDomain: true,
        emails: [
          { id: 1, emailName: "johnny@example.com", isSelected: true },
          { id: 2, emailName: "jan@example.com", isSelected: false },
        ],
      },
      {
        domainName: "test.com",
        hasDomain: false,
        emails: [{ id: 3, emailName: "test@test.com", isSelected: true }],
      },
    ];

    const searchInput = "jan";
    const expected: DisplayEmailsData[] = [
      {
        domainName: "example.com",
        hasDomain: true,
        emails: [{ id: 2, emailName: "jan@example.com", isSelected: false }],
      },
    ];
    expect(filterDomainsByEmail(data, searchInput)).toEqual(expected);
  });

  it("should return an empty array if no emails match the search input", () => {
    const data: DisplayEmailsData[] = [
      {
        domainName: "example.com",
        hasDomain: true,
        emails: [
          { id: 1, emailName: "johnny@example.com", isSelected: true },
          { id: 2, emailName: "vincent@example.com", isSelected: false },
        ],
      },
      {
        domainName: "test.com",
        hasDomain: false,
        emails: [{ id: 3, emailName: "test@test.com", isSelected: true }],
      },
    ];

    const searchInput = "meaning";
    expect(filterDomainsByEmail(data, searchInput)).toEqual([]);
  });

  it("should return the original data if all emails match the search input", () => {
    const data: DisplayEmailsData[] = [
      {
        domainName: "example.com",
        hasDomain: true,
        emails: [
          { id: 1, emailName: "lauren@example.com", isSelected: true },
          { id: 2, emailName: "laura@example.com", isSelected: false },
        ],
      },
    ];

    const searchInput = "laur";
    expect(filterDomainsByEmail(data, searchInput)).toEqual(data);
  });
});

describe("isValidEmail", () => {
  it("should return true for valid emails", () => {
    expect(isValidEmail("john.doe@example.com")).toBe(true);
    expect(isValidEmail("user+mailbox@domain.co.uk")).toBe(true);
  });

  it("should return false for invalid emails", () => {
    expect(isValidEmail("testingMctestington")).toBe(false);
    expect(isValidEmail("@test.com")).toBe(false);
    expect(isValidEmail("fail@.com")).toBe(false);
  });
});
