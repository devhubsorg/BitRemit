import {
  createContext,
  useContext,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface DialogContextValue {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return ctx;
}

interface DialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChangeAction, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChangeAction }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChangeAction } = useDialogContext();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChangeAction(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChangeAction]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onMouseDown={() => onOpenChangeAction(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        {...props}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          borderRadius: "12px",
          padding: "18px",
          background: "#1f2937",
          border: "1px solid #374151",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  style,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      style={{
        margin: 0,
        fontSize: "18px",
        fontWeight: 700,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function DialogFooter({
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        marginTop: "14px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
