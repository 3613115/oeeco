"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type AdminCopyButtonProps = {
  value: string;
  label?: string;
};

export function AdminCopyButton({ value, label = "Copy" }: AdminCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="admin-copy-button" type="button" onClick={copyValue} disabled={!value}>
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}
