import toast, { type Toast as HotToast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { TiTimes } from "react-icons/ti";
import type { ReactNode } from "react";

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
}: {
  t: HotToast;
  type: ToastType;
  title: string;
  message?: string;
  actions?: ReactNode;
}) => {
  const styles = toastStyles[type];

  return (
    <motion.div
      initial="hidden"
      animate={t.visible ? "visible" : "hidden"}
      variants={toastMotionVariants}
      transition={{ duration: 0.24, ease: "easeOut" }}
      layout
      className={`max-w-md w-full bg-card border border-border rounded-lg shadow-lg pointer-events-auto transition-all duration-300 ${styles.background}`}>
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

            {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
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

const buildActionButtonClass = (variant: "confirm" | "cancel") => {
  if (variant === "confirm") {
    return "inline-flex items-center justify-center rounded-md bg-error px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-error";
  }

  return "inline-flex items-center justify-center rounded-md border border-muted/20 bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border";
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

// Export convenient toast functions
export const showSuccessToast = (options: ToastOptions) => showToast("success", options);
export const showErrorToast = (options: ToastOptions) => showToast("error", options);
export const showWarningToast = (options: ToastOptions) => showToast("warning", options);
export const showInfoToast = (options: ToastOptions) => showToast("info", options);

// For custom usage
export { toast };
