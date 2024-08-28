import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DisplayRecipients from "./DisplayRecipients";

jest.mock("./shared/EmailRow", () => (props) => (
  <div data-testid="email-row" onClick={props.onClick}>
    {props.title}
  </div>
));

describe("DisplayRecipients Component", () => {
  const mockRemoveDomain = jest.fn();
  const mockToggleEmail = jest.fn();

  const sampleEmailsData = [
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
      hasDomain: true,
      emails: [{ id: 3, emailName: "test@test.com", isSelected: true }],
    },
    {
      domainName: "",
      hasDomain: false,
      emails: [{ id: 4, emailName: "user@example.com", isSelected: true }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the headings and the correct number of AccordionItems", () => {
    render(
      <DisplayRecipients
        domainEmails={sampleEmailsData}
        removeDomain={mockRemoveDomain}
        toggleEmail={mockToggleEmail}
        allowEditing={true}
      />
    );

    expect(screen.getByText(/Company recipients/i)).toBeInTheDocument();
    expect(screen.getByText(/Email recipients/i)).toBeInTheDocument();
    expect(screen.getByText(/johnny@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
  });

  it("should call toggleEmail with correct parameters when an EmailRow is clicked", () => {
    render(
      <DisplayRecipients
        domainEmails={sampleEmailsData}
        removeDomain={mockRemoveDomain}
        toggleEmail={mockToggleEmail}
        allowEditing={true}
      />
    );

    const emailRow = screen.getAllByTestId("email-row")[0];
    fireEvent.click(emailRow);

    expect(mockToggleEmail).toHaveBeenCalledWith("example.com", 1);
  });

  it("should not render emails that are not selected", () => {
    render(
      <DisplayRecipients
        domainEmails={sampleEmailsData}
        removeDomain={mockRemoveDomain}
        toggleEmail={mockToggleEmail}
        allowEditing={true}
      />
    );

    expect(screen.queryByText(/vincent@example.com/i)).toBeNull();
  });
});
