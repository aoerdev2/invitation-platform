"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    createDefaultInvitationSections,
} from "@/lib/invitation/sections";
import { supabase } from "@/lib/supabase/client";

function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/&/g, " dan ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getUniqueSlug(baseSlug) {
    let slug = baseSlug || "undangan";
    let counter = 1;

    while (true) {
        const { data, error } = await supabase
            .from("invitations")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return slug;
        }

        counter++;
        slug = `${baseSlug}-${counter}`;
    }
}

export default function CreateInvitationForm({
    eventType,
    template,
}) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const previewSlug =
        generateSlug(title) || "slug-undangan";

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Judul undangan wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                router.push("/login");
                return;
            }

            const baseSlug = generateSlug(title);

            if (!baseSlug) {
                setError("Judul undangan belum valid.");
                setLoading(false);
                return;
            }

            const slug = await getUniqueSlug(baseSlug);

            const { data: invitation, error: insertError } =
                await supabase
                    .from("invitations")
                    .insert({
                        owner_id: user.id,
                        event_type_id: eventType.id,
                        template_id: template.id,
                        title: title.trim(),
                        slug,
                        status: "draft",
                    })
                    .select("id")
                    .single();

            if (insertError) throw insertError;

            const sections = createDefaultInvitationSections(invitation.id);

            const { error: sectionsError } = await supabase
                .from("invitation_sections")
                .insert(sections);

            if (sectionsError) {
                await supabase
                    .from("invitations")
                    .delete()
                    .eq("id", invitation.id);

                throw sectionsError;
            }

            router.push(
                `/dashboard/edit/${invitation.id}`
            );

            router.refresh();
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                "Gagal membuat undangan."
            );

            setLoading(false);
        }
    }

    return (
        <form
            className="basic-form-card"
            onSubmit={handleSubmit}
        >
            <div className="selected-info">
                <span>Jenis Acara</span>

                <strong>
                    {eventType.name}
                </strong>
            </div>

            <div className="selected-info">
                <span>Template</span>

                <strong>
                    {template.name}
                </strong>
            </div>

            <div className="form-divider" />

            <div className="form-group">
                <label htmlFor="title">
                    Judul Undangan
                </label>

                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="Contoh: Pernikahan Andi & Sinta"
                    required
                    autoFocus
                />

                <small>
                    Judul digunakan sebagai nama undangan.
                </small>
            </div>

            <div className="form-group">
                <label>
                    Link Undangan
                </label>

                <div className="slug-preview">
                    <span>/i/</span>

                    <strong>
                        {previewSlug}
                    </strong>
                </div>

                <small>
                    Link dibuat otomatis dari judul.
                </small>
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="basic-submit"
                disabled={loading}
            >
                {loading
                    ? "Membuat Draft..."
                    : "Buat Draft →"}
            </button>
        </form>
    );
}