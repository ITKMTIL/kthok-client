"use client";

import { useState, type FormEvent } from "react";

const MAX_URL_LENGTH = 200;

export function AddTrackForm({
  disabled,
  onAdd,
}: {
  disabled: boolean;
  onAdd: (url: string) => Promise<string | null>;
}) {
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = url.trim();
    if (!value || adding) return;
    setAdding(true);
    setError(null);
    const failure = await onAdd(value);
    setAdding(false);
    setError(failure);
    if (!failure) setUrl("");
  }

  return (
    <div>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="doodle-field min-w-0 flex-1 py-1.5 lg:text-sm"
          type="url"
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="วางลิงก์ YouTube"
          aria-label="ลิงก์ YouTube"
          maxLength={MAX_URL_LENGTH}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="doodle-btn px-3 text-sm font-bold"
          disabled={disabled || adding || !url.trim()}
        >
          {adding ? "…" : "เพิ่มคิว"}
        </button>
      </form>
      {error && (
        <p className="mt-1 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
