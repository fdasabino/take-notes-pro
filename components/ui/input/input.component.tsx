import { InputProps } from "@/components/ui/input/types/input.types";
import { useField } from "formik";
import React from "react";

const InputComponent: React.FC<InputProps> = ({
  icon,
  placeholder,
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const [field, meta] = useField(props.name as string);
  const isError = meta.touched && meta.error;
  const resolvedPlaceholder = isError ? meta.error : placeholder;
  const renderIcon = () => icon && icon({ size: 20 });

  // Calculate character count safely
  const charCount = field.value ? field.value.length : 0;

  // Conditional rendering for the text area or the input field
  const inputOrTextarea =
    props.type === "textarea" ? (
      <textarea
        {...field}
        {...props}
        maxLength={maxLength}
        className={`${"text-base_white"} w-full p-1 bg-transparent focus:outline-none placeholder:text-sm ${
          isError ? "placeholder:text-error" : "placeholder:text-base_gray"
        } `}
        rows={props.rows || 4}
        placeholder={resolvedPlaceholder}
      />
    ) : (
      <input
        {...field}
        {...props}
        maxLength={maxLength}
        className={` ${"text-base_white"} w-full p-1 bg-transparent focus:outline-none placeholder:text-sm ${
          isError ? "placeholder:text-error" : "placeholder:text-base_gray"
        }`}
        placeholder={resolvedPlaceholder}
      />
    );

  return (
    <>
      {showCharCount && (
        <div
          className={`flex items-center justify-end h-full ${"text-base_gray"} ${
            isError ? "text-error" : ""
          }  text-[9px] sm:text-xs font-bold`}>
          <span>{charCount}</span> /<span>{maxLength ? maxLength : ""}</span>
        </div>
      )}
      <div
        className={`relative flex items-center gap-2 p-2 border rounded-b-md rounded-tl-md w-full ${"border-base_gray"} ${
          isError ? "border-error" : ""
        }`}>
        <span className={`text-base_primary ${isError ? "text-error" : ""}`}>{renderIcon()}</span>
        {inputOrTextarea}
      </div>
    </>
  );
};

export default InputComponent;
