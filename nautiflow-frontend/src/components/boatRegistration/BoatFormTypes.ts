import type { ChangeEvent } from "react";

export type BoatFormData = {
  captain: string;
  email: string;
  phone: string;
  name: string;
  capacity: string;
  zone: string;
  description: string;
};

export type UploadedFile = {
  file: File;
  previewUrl: string;
};

export type BoatDocument = {
  name: string;
  file: File;
};

export type BoatRegistrationData = BoatFormData & {
  photos: File[];
  documents: BoatDocument[];
};

export type BoatRegistrationFormProps = {
  onSubmit?: (data: BoatRegistrationData) => Promise<void>;
};

export const INITIAL_FORM: BoatFormData = {
  captain: "",
  email: "",
  phone: "",
  name: "",
  capacity: "",
  zone: "Cancún",
  description: "",
};

export const DOCUMENT_TYPES = [
  "Licencia del capitán",
  "Antecedentes penales",
  "Seguro de la Embarcación",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];



export type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export type UploadZoneProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  accept: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
};


export type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost";
};