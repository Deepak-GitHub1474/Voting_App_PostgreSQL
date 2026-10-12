import "./index.css";

import ReactDOM from "react-dom/client";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import { PageSkeleton } from "./components/layout/Shell.jsx";
import { router } from "./router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
      <RouterProvider router={router} fallbackElement={<PageSkeleton />} />
      <Toaster
        position="top-right"
        containerClassName="!right-4 !top-4"
        toastOptions={{
          duration: 3500,
          className: "!relative !overflow-visible !rounded-[0.875rem] !border !border-line !text-sm !text-ink !shadow-none",
          success: { iconTheme: { primary: "#22805a", secondary: "#ffffff" } },
        }}
      >
        {(item) => (
          <ToastBar toast={item}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {item.type !== "loading" && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(item.id)}
                    className={`absolute -right-2 -top-2 grid size-5 place-items-center rounded-full text-white transition-opacity hover:opacity-80 ${
                      item.type === "error" ? "bg-danger-600" : item.type === "success" ? "bg-brand-600" : "bg-ink"
                    }`}
                    aria-label="Dismiss notification"
                  >
                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
  </>
);
