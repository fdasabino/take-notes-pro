import toast, { type Toast as HotToast } from "react-hot-toast";
import { motion } from "motion/react";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { TiTimes } from "react-icons/ti";
import { type FormEvent, type ReactNode, useState } from "react";
import { getThemePreference, setThemePreference, type ThemePreference } from "@/shared/lib/theme";
import Button from "@/shared/ui/button/Button";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

interface ConfirmToastOptions extends Omit<ToastOptions, "duration"> {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  duration?: number;
  type?: ToastType;
}

const toastStyles = {
  success: {
    icon: "text-emerald-500",
    iconBg: "bg-emerald-100",
    background: "bg-surface",
  },
  error: {
    icon: "text-red-500",
    iconBg: "bg-red-100",
    background: "bg-surface",
  },
  warning: {
    icon: "text-amber-500",
    iconBg: "bg-amber-100",
    background: "bg-surface",
  },
  info: {
    icon: "text-blue-500",
    iconBg: "bg-blue-100",
    background: "bg-surface",
  },
};

const toastMotionVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.95, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const ToastContent = ({
  t,
  type,
  title,
  message,
  actions,
  actionsWrapperClassName,
}: {
  t: HotToast;
  type: ToastType;
  title: string;
  message?: string;
  actions?: ReactNode;
  actionsWrapperClassName?: string;
}) => {
  const styles = toastStyles[type];
  const actionsWrapper = actionsWrapperClassName ?? "flex flex-wrap gap-2";

  return (
    <motion.div
      initial="hidden"
      animate={t.visible ? "visible" : "hidden"}
      variants={toastMotionVariants}
      transition={{ duration: 0.24, ease: "easeOut" }}
      layout
      className={`max-w-md w-full bg-card border border-muted/20 rounded-lg shadow-lg pointer-events-auto transition-all duration-300 ${styles.background}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2 ${styles.icon}`}>
            <ToastIcon type={type} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-foreground">{title}</p>
            {message && (
              <p
                className="mt-1 text-foreground opacity-70"
                style={{ fontSize: "0.875rem" }}>
                {message}
              </p>
            )}

            {actions ? <div className={`mt-4 ${actionsWrapper}`}>{actions}</div> : null}
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-foreground hover:text-foreground/80 transition-colors">
            <TiTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconClass = "h-5 w-5";

  switch (type) {
    case "success":
      return <FaCheckCircle className={iconClass} />;
    case "error":
      return <FaTimesCircle className={iconClass} />;
    case "warning":
      return <GoAlertFill className={iconClass} />;
    case "info":
      return <FaInfoCircle className={iconClass} />;
  }

  return null;
};

const showToast = (type: ToastType, options: ToastOptions) => {
  const { title, message, duration = 4000 } = options;

  toast.custom(
    (t) => (
      <ToastContent
        t={t}
        type={type}
        title={title}
        message={message}
      />
    ),
    { duration }
  );
};

const buildActionButtonClass = (variant: "confirm" | "cancel" | "primary") => {
  if (variant === "confirm") {
    return "inline-flex items-center justify-center rounded-md bg-error px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-error disabled:opacity-60 disabled:cursor-not-allowed";
  }

  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed";
  }

  return "inline-flex items-center justify-center rounded-md border border-muted/20 bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border disabled:opacity-60 disabled:cursor-not-allowed";
};

export const showConfirmDeleteToast = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  duration,
  type = "warning",
}: ConfirmToastOptions) => {
  const toastDuration = duration ?? Infinity;

  return toast.custom(
    (t) => {
      const handleConfirm = () => {
        Promise.resolve(onConfirm?.()).finally(() => toast.dismiss(t.id));
      };

      const handleCancel = () => {
        Promise.resolve(onCancel?.()).finally(() => toast.dismiss(t.id));
      };

      return (
        <ToastContent
          t={t}
          type={type}
          title={title}
          message={message}
          actions={
            <>
              <button
                type="button"
                onClick={handleCancel}
                className={buildActionButtonClass("cancel")}>
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={buildActionButtonClass("confirm")}>
                {confirmLabel}
              </button>
            </>
          }
        />
      );
    },
    { duration: toastDuration }
  );
};

interface ThemeSelectionOptionConfig {
  value: ThemePreference;
  label: string;
  description: string;
}

const THEME_OPTIONS: ThemeSelectionOptionConfig[] = [
  {
    value: "system",
    label: "System",
    description: "Match your device setting automatically.",
  },
  {
    value: "light",
    label: "Light",
    description: "Bright background with dark text.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Dim background with light text.",
  },
];

const ThemeSelectionOption = ({
  option,
  isSelected,
  onSelect,
}: {
  option: ThemeSelectionOptionConfig;
  isSelected: boolean;
  onSelect: (value: ThemePreference) => void;
}) => (
  <label
    htmlFor={`theme-${option.value}`}
    className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition-colors ${
      isSelected
        ? "border-primary bg-primary/10 text-foreground"
        : "border-muted/20 hover:border-primary/60 hover:bg-muted/20"
    }`}>
    <input
      id={`theme-${option.value}`}
      type="radio"
      name="appearance-theme"
      value={option.value}
      checked={isSelected}
      onChange={() => onSelect(option.value)}
      className="mt-1 h-4 w-4"
    />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">{option.label}</span>
      <span className="text-xs text-foreground/70">{option.description}</span>
    </div>
  </label>
);

const ThemeSelectionForm = ({
  initialPreference,
  onApply,
  onCancel,
}: {
  initialPreference: ThemePreference;
  onApply: (preference: ThemePreference) => void;
  onCancel: () => void;
}) => {
  const [selectedPreference, setSelectedPreference] = useState<ThemePreference>(initialPreference);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(selectedPreference);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        {THEME_OPTIONS.map((option) => (
          <ThemeSelectionOption
            key={option.value}
            option={option}
            isSelected={option.value === selectedPreference}
            onSelect={setSelectedPreference}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="danger"
          type="button"
          onClick={onCancel}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={selectedPreference === initialPreference}>
          Apply
        </Button>
      </div>
    </form>
  );
};

interface ThemeSelectionToastOptions {
  title?: string;
  message?: string;
  duration?: number;
  onApply?: (preference: ThemePreference) => void | Promise<void>;
  onCancel?: () => void;
  type?: ToastType;
}

export const showThemeSelectionToast = ({
  title = "Choose theme",
  message = "Pick how Take Notes Pro should look.",
  duration,
  onApply,
  onCancel,
  type = "info",
}: ThemeSelectionToastOptions = {}) => {
  const toastDuration = duration ?? Infinity;
  const initialPreference = getThemePreference();

  return toast.custom(
    (t) => {
      const handleApply = (preference: ThemePreference) => {
        setThemePreference(preference);

        Promise.resolve(onApply?.(preference)).finally(() => toast.dismiss(t.id));
      };

      const handleCancel = () => {
        onCancel?.();
        toast.dismiss(t.id);
      };

      return (
        <ToastContent
          t={t}
          type={type}
          title={title}
          message={message}
          actionsWrapperClassName="flex flex-col gap-4"
          actions={
            <ThemeSelectionForm
              initialPreference={initialPreference}
              onApply={handleApply}
              onCancel={handleCancel}
            />
          }
        />
      );
    },
    { duration: toastDuration }
  );
};

// Export convenient toast functions
export const showSuccessToast = (options: ToastOptions) => showToast("success", options);
export const showErrorToast = (options: ToastOptions) => showToast("error", options);
export const showWarningToast = (options: ToastOptions) => showToast("warning", options);
export const showInfoToast = (options: ToastOptions) => showToast("info", options);

// For custom usage
export { toast };
