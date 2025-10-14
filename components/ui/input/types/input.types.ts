import { InputHTMLAttributes } from "react";
import { IconType } from "react-icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon?: IconType;
  name: string;
  rows?: number;
  placeholder?: string;
  type?: "text" | "textarea" | "email" | "number" | "password" | "phone" | "checkbox";
  label?: string;
  error?: string;
  touched?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  csrfToken?: string;
  callbackUrl?: string;
  maxLength?: number;
  showCharCount?: boolean;
}
