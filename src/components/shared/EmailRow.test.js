import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailRow from "./EmailRow";
import { EmailActionTypes } from "../../types";

describe("EmailRow Component", () => {
  const mockOnClick = jest.fn();

  it("should render the EmailRow with correct title and action", () => {
    render(
      <EmailRow
        title="Test Email"
        action={EmailActionTypes.ADD}
        onClick={mockOnClick}
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: /Select Test Email/i,
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Test Email");
    expect(buttonElement).toHaveAttribute("aria-label", "Select Test Email");
  });

  it("should call onClick when the button is clicked", () => {
    render(
      <EmailRow
        title="Test Email"
        action={EmailActionTypes.ADD}
        onClick={mockOnClick}
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: /Select Test Email/i,
    });
    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct aria-label and title for REMOVE action", () => {
    render(
      <EmailRow
        title="Another Email"
        action={EmailActionTypes.REMOVE}
        onClick={mockOnClick}
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: /Remove Another Email/i,
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Another Email");
    expect(buttonElement).toHaveAttribute("aria-label", "Remove Another Email");
    expect(buttonElement).toHaveAttribute("title", "Remove Another Email");
  });

  it("should apply correct base styles", () => {
    render(
      <EmailRow
        title="Styled Email"
        action={EmailActionTypes.ADD}
        onClick={mockOnClick}
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: /Select Styled Email/i,
    });

    expect(buttonElement).toHaveStyle(`background-color: #fff`);
  });
});
