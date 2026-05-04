"use client";

import { useEffect, useState } from "react";

export type ToastVariant = "default" | "destructive";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toastState: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener([...toastState]);
  }
}

function dismiss(id: string) {
  toastState = toastState.filter((toastItem) => toastItem.id !== id);
  emit();
}

export function toast(input: ToastInput) {
  const id = crypto.randomUUID();
  const nextToast: ToastItem = {
    id,
    variant: input.variant ?? "default",
    duration: input.duration ?? 4000,
    title: input.title,
    description: input.description,
  };

  toastState = [nextToast, ...toastState].slice(0, 5);
  emit();

  window.setTimeout(() => dismiss(id), nextToast.duration);

  return { id, dismiss: () => dismiss(id) };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastState);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}
