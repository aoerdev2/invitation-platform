import { notFound } from "next/navigation";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

import DashboardSidebar from "@/components/DashboardSidebar";
import SectionToggle from "@/components/SectionToggle";
import InvitationPeopleForm from "@/components/InvitationPeopleForm";

import "../../dashboard.css";
import "../edit.css";

export const instant = false;

const SECTION_META = {
    cover: {
        label: "Cover",
        description: "Tampilan pembuka undangan",
    },

    people: {
        label: "Mempelai / Orang",
        description: "Informasi orang dalam acara",
    },

    event: {
        label: "Acara",
        description: "Tanggal dan waktu acara",
    },

    location: {
        label: "Lokasi",
        description: "Tempat dan maps",
    },

    countdown: {
        label: "Countdown",
        description: "Hitung mundur menuju acara",
    },

    gallery: {
        label: "Galeri",
        description: "Foto-foto acara",
    },

    speech: {
        label: "Ucapan",
        description: "Kata-kata dan doa",
    },

    rsvp: {
        label: "RSVP",
        description: "Konfirmasi kehadiran tamu",
    },

    messages: {
        label: "Pesan",
        description: "Pesan dari para tamu",
    },

    closing: {
        label: "Closing",
        description: "Bagian penutup undangan",
    },

    music: {
        label: "Music",
        description: "Musik latar undangan",
    },
};

export default async function EditInvitationPage({
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

    const {
        data: invitation,
        error: invitationError,
    } = await supabase
        .from("invitations")
        .select(`
            id,
            title,
            slug,
            status,
            event_type_id,
            template_id,
            created_at
        `)
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

    if (invitationError || !invitation) {
        notFound();
    }

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
        .order("sort_order", {
            ascending: true,
        });

    if (sectionsError) {
        throw new Error(
            `Gagal mengambil section: ${sectionsError.message}`
        );
    }

    const peopleEnabled = sections?.some(
        (section) =>
            section.section_key === "people" &&
            section.enabled
    );

    return (
        <div className="dashboard">
            <DashboardSidebar />

            <main className="dashboard-main">

                <div className="dashboard-topbar">
                    <div className="topbar-title">
                        Edit Undangan
                    </div>

                    <div className="admin-badge">
                        Admin
                    </div>
                </div>

                <div className="dashboard-content">

                    {/* HEADER */}
                    <div className="edit-header">
                        <div>
                            <span className="edit-status">
                                {invitation.status.toUpperCase()}
                            </span>

                            <h1>
                                {invitation.title}
                            </h1>

                            <p>
                                /i/{invitation.slug}
                            </p>
                        </div>
                    </div>


                    {/* BUILDER */}
                    <div className="builder-layout">

                        {/* =========================
                            SECTION MANAGER
                        ========================== */}

                        <div className="builder-card">

                            <div className="builder-card-header">
                                <h2>
                                    Konten Undangan
                                </h2>

                                <p>
                                    Atur isi dan susunan bagian
                                    undangan kamu.
                                </p>
                            </div>


                            <div className="builder-section-list">

                                {sections?.map((section) => {

                                    const meta =
                                        SECTION_META[
                                        section.section_key
                                        ];

                                    return (
                                        <div
                                            className="builder-section"
                                            key={section.id}
                                        >

                                            <div>
                                                <strong>
                                                    {meta?.label ||
                                                        section.section_key}
                                                </strong>

                                                <span>
                                                    {meta?.description ||
                                                        "Bagian undangan"}
                                                </span>
                                            </div>

                                            <SectionToggle
                                                sectionId={
                                                    section.id
                                                }
                                                initialEnabled={
                                                    section.enabled
                                                }
                                            />

                                        </div>
                                    );
                                })}

                            </div>

                        </div>


                        {/* =========================
                            DETAIL DRAFT
                        ========================== */}

                        <div className="builder-card">

                            <div className="builder-card-header">
                                <h2>
                                    Detail Draft
                                </h2>
                            </div>


                            <div className="detail-row">
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {invitation.status}
                                </strong>
                            </div>


                            <div className="detail-row">
                                <span>
                                    Link
                                </span>

                                <strong>
                                    /i/{invitation.slug}
                                </strong>
                            </div>


                            <div className="detail-row">
                                <span>
                                    Section
                                </span>

                                <strong>
                                    {sections?.length || 0} bagian
                                </strong>
                            </div>


                            <div className="detail-row">
                                <span>
                                    ID
                                </span>

                                <strong className="id-text">
                                    {invitation.id}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        DATA MEMPELAI
                    ========================== */}

                    {peopleEnabled && (
                        <div className="builder-card builder-card-full">

                            <InvitationPeopleForm
                                invitationId={
                                    invitation.id
                                }
                            />

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}
