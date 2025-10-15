import toast from "react-hot-toast";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { TiTimes } from "react-icons/ti";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
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
  const styles = toastStyles[type];

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-card border border-border rounded-lg shadow-lg pointer-events-auto transition-all duration-300 ${
          styles.background
        }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2 ${styles.icon}`}>
              <ToastIcon type={type} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-foreground">{title}</p>
              {message && (
                <p
                  className="mt-1 text-foreground opacity-70"
                  style={{ fontSize: "0.875rem" }}>
                  {message}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-shrink-0 text-foreground hover:text-foreground/80 transition-colors">
              <TiTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    ),
    { duration }
  );
};

// Export convenient toast functions
export const showSuccessToast = (options: ToastOptions) => showToast("success", options);
export const showErrorToast = (options: ToastOptions) => showToast("error", options);
export const showWarningToast = (options: ToastOptions) => showToast("warning", options);
export const showInfoToast = (options: ToastOptions) => showToast("info", options);

// For custom usage
export { toast };
