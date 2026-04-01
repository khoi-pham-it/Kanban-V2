import type { ButtonHTMLAttributes, ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

const variantClass ={
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
};

export type AlertProps = {
    onClose: () => void;
    variant?: AlertVariant;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLDivElement>;

const Alert = ({ onClose, variant = "info", children, className = "", ...rest }: AlertProps) => {
    const variantClassName = variantClass[variant];
    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg ${variantClassName} ${className}`}
            {...rest}
        >
            {children}
            <button
                onClick={onClose}
                className="ml-auto text-lg font-bold leading-none"
                aria-label="Close"
            >
                &times;
            </button>
        </div>
    );
};

export default Alert;