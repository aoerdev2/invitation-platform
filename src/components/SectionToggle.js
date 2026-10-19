"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SectionToggle({
    sectionId,
    initialEnabled,
}) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        if (loading) return;

        const newValue = !enabled;

        setLoading(true);

        const { error } = await supabase
            .from("invitation_sections")
            .update({
                enabled: newValue,
                updated_at: new Date().toISOString(),
            })
            .eq("id", sectionId);

        if (error) {
            console.error("Gagal update section:", error);
            setLoading(false);
            return;
        }

        setEnabled(newValue);
        setLoading(false);
    }

    return (
        <button
            type="button"
            className={`section-toggle ${enabled ? "active" : ""}`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={
                enabled
                    ? "Nonaktifkan section"
                    : "Aktifkan section"
            }
        >
            <span className="section-toggle-track">
                <span className="section-toggle-thumb" />
            </span>

            <span className="section-toggle-label">
                {loading
                    ? "Menyimpan..."
                    : enabled
                        ? "Aktif"
                        : "Nonaktif"}
            </span>
        </button>
    );
}