"use client";

import { Logo } from "@/components/Logo";
import { useToast } from "@/ui/hooks/useToast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/ui/Toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, withLogo, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        {withLogo && (
                            <div className="max-w-14 self-start">
                                <Logo className="mx-auto scale-75 md:scale-100" />
                            </div>
                        )}
                        <div className="grid flex-1 gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
