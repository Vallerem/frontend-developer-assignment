export type EmailData = {
  id: number;
  email: string;
  isSelected: boolean;
};

export type DisplayEmailsData = {
  domainName: string | null;
  hasDomain: boolean;
  emails: {
    id: number;
    emailName: string;
    isSelected: boolean;
  }[];
};

export enum EmailActionTypes {
  ADD = "Add",
  REMOVE = "Remove",
}