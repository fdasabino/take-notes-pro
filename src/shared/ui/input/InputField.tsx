import { InputProps } from "@/shared/ui/input/input.types";
import { useField } from "formik";
import React from "react";

const InputField: React.FC<InputProps> = ({
  icon,
  placeholder,
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const [field, meta] = useField(props.name as string);
  const showError = Boolean(meta.touched && meta.error);
  const errorMessage = showError ? meta.error : "";
  const resolvedPlaceholder = placeholder;
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
        className={`${"text-foreground"} w-full p-1 bg-transparent focus:outline-none placeholder:text-sm ${
          showError ? "placeholder:text-error" : "placeholder:text-muted/80"
        } `}
        rows={props.rows || 4}
        placeholder={resolvedPlaceholder}
      />
    ) : (
      <input
        {...field}
        {...props}
        maxLength={maxLength}
        className={` ${"text-foreground"} w-full p-1 bg-transparent focus:outline-none placeholder:text-sm ${
          showError ? "placeholder:text-error" : "placeholder:text-muted/80"
        }`}
        placeholder={resolvedPlaceholder}
      />
    );

  return (
    <>
      <div className={`flex items-center justify-between h-full`}>
        <div className="text-xs text-error">{errorMessage}</div>
        <div>
          {showCharCount && (
            <>
              <span className={`text-xs ${showError ? "text-error" : "text-foreground"}`}>
                {charCount}
              </span>{" "}
              <span className={`text-xs ${showError ? "text-error" : "text-foreground"}`}>/</span>
              <span className={`text-xs ${showError ? "text-error" : "text-foreground"}`}>
                {maxLength ? maxLength : ""}
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className={`relative flex items-center gap-2 p-2 border rounded-b-md w-full mb-3 ${
          showError ? "border-error" : "border-muted/20"
        }`}>
        <span className={` ${showError ? "text-error" : "text-foreground"}`}>{renderIcon()}</span>
        {inputOrTextarea}
      </div>
    </>
  );
};

export default InputField;
