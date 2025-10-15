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
          isError ? "placeholder:text-error" : "placeholder:text-muted/50"
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
          isError ? "placeholder:text-error" : "placeholder:text-muted/50"
        }`}
        placeholder={resolvedPlaceholder}
      />
    );

  return (
    <>
      <div className={`flex items-center justify-between h-full`}>
        <div className="text-xs text-error">{meta.error}</div>
        <div>
          {showCharCount && (
            <>
              <span className={`text-foreground text-xs ${isError ? "text-error" : ""}`}>
                {charCount}
              </span>{" "}
              <span className={`text-foreground text-xs ${isError ? "text-error" : ""}`}>/</span>
              <span className={`text-foreground text-xs ${isError ? "text-error" : ""}`}>
                {maxLength ? maxLength : ""}
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className={`relative flex items-center gap-2 p-2 border rounded-b-md w-full mb-3 ${"border-muted/20"} ${
          isError ? "border-error" : ""
        }`}>
        <span className={`text-foreground ${isError ? "text-error" : ""}`}>{renderIcon()}</span>
        {inputOrTextarea}
      </div>
    </>
  );
};

export default InputComponent;
