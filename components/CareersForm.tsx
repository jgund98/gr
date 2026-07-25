"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";

/**
 * Resume drop — a real form (FormSubmit relay to Gus's inbox, file
 * attached). No backend to maintain; redirects back with ?sent=1.
 */
export default function CareersForm() {
  const params = useSearchParams();
  const sent = params.get("sent") === "1";
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (sent) {
    return (
      <div className="chamfer border border-green/50 bg-ink-2 p-8 text-center md:p-12">
        <p className="tag-index">Received</p>
        <h3 className="mt-3 display text-3xl md:text-4xl">In the pile — the good one.</h3>
        <p className="lede mx-auto mt-4 max-w-md text-mist">
          Your resume is on its way to the team. If there's a fit anywhere in
          the portfolio, you'll hear from a human.
        </p>
      </div>
    );
  }

  return (
    <form
      action="https://formsubmit.co/gusrenny@me.com"
      method="POST"
      encType="multipart/form-data"
      onSubmit={() => setSubmitting(true)}
      className="chamfer border border-line bg-ink-2 p-7 md:p-10"
    >
      <input type="hidden" name="_subject" value="Resume — GUSRENNY.COM careers" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={`${site.domain}/careers?sent=1`} />

      <p className="tag-index">Introduce yourself</p>
      <h3 className="mt-3 display text-3xl md:text-4xl">Send your resume</h3>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label text-faint">Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="mt-2 w-full border border-line bg-ink px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-faint focus:border-green"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="label text-faint">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-2 w-full border border-line bg-ink px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-faint focus:border-green"
            placeholder="you@email.com"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="label text-faint">What are you great at?</span>
        <textarea
          name="message"
          rows={3}
          className="mt-2 w-full resize-none border border-line bg-ink px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-faint focus:border-green"
          placeholder="A few sentences is plenty."
        />
      </label>

      <label className="mt-5 block cursor-pointer">
        <span className="label text-faint">Resume</span>
        <span className="mt-2 flex items-center justify-between gap-4 border border-dashed border-green/50 bg-ink px-4 py-4 transition-colors hover:border-green">
          <span className={fileName ? "text-paper" : "text-faint"}>
            {fileName ?? "Attach your resume — PDF or Word"}
          </span>
          <span className="chamfer-sm shrink-0 bg-green px-4 py-2 text-sm font-semibold text-ink">
            Browse
          </span>
        </span>
        <input
          type="file"
          name="attachment"
          accept=".pdf,.doc,.docx"
          required
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="chamfer-sm mt-8 w-full bg-green px-8 py-4 font-semibold text-ink transition-colors hover:bg-green-bright disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Sending…" : "Send it in"}
      </button>
      <p className="mt-4 text-sm text-faint">
        Goes straight to the team at {site.email}.
      </p>
    </form>
  );
}
