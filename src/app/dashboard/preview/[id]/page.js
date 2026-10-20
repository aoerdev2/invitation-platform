import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

import WeddingTemplate from "@/components/templates/WeddingTemplate";
import "@/components/templates/WeddingTemplate.css";

export const instant = false;

export default async function PreviewInvitationPage({
    params,
}) {
    await connection();

    const { id } = await params;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    // =========================
    // DATA UNDANGAN
    // =========================

    const {
        data: invitation,
        error,
    } = await supabase
        .from("invitations")
        .select(`
            id,
            title,
            slug,
            status,
            event_type_id,
            template_id
        `)
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

    if (error || !invitation) {
        notFound();
    }

    // =========================
    // DATA SECTION
    // =========================

    const {
        data: sections,
        error: sectionsError,
    } = await supabase
        .from("invitation_sections")
        .select(`
            id,
            section_key,
            enabled,
            sort_order,
            settings
        `)
        .eq("invitation_id", invitation.id)
        .eq("enabled", true)
        .order("sort_order", {
            ascending: true,
        });

    if (sectionsError) {
        throw new Error(
            `Gagal mengambil section: ${sectionsError.message}`
        );
    }

    // =========================
    // DATA MEMPELAI
    // =========================

    const {
        data: people,
        error: peopleError,
    } = await supabase
        .from("invitation_people")
        .select(`
            id,
            name,
            role,
            photo,
            description,
            sort_order
        `)
        .eq("invitation_id", invitation.id)
        .order("sort_order", {
            ascending: true,
        });

    if (peopleError) {
        throw new Error(
            `Gagal mengambil data mempelai: ${peopleError.message}`
        );
    }

    // =========================
    // GABUNGKAN DATA
    // =========================

    const invitationWithData = {
        ...invitation,
        people: people || [],
    };

    // =========================
    // RENDER TEMPLATE
    // =========================

    return (
        <WeddingTemplate
            invitation={invitationWithData}
            sections={sections || []}
        />
    );
}