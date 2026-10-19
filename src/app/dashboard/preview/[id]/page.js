import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function PreviewInvitationPage({ params }) {
    await connection();

    const { id } = await params;

    const supabase = await createClient();


    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    const { data: invitation, error } = await supabase
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

    const { data: sections, error: sectionsError } = await supabase
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
        .order("sort_order", { ascending: true });

    if (sectionsError) {
        throw new Error(
            `Gagal mengambil section: ${sectionsError.message}`
        );
    }

    return (
        <main>
            <h1>Preview Undangan</h1>

            <p>{invitation.title}</p>

            <hr />

            {sections?.map((section) => (
                <div key={section.id}>
                    <strong>{section.section_key}</strong>
                </div>
            ))}
        </main>
    );
}