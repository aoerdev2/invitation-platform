import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DashboardSidebar from "@/components/DashboardSidebar";

import "../../dashboard.css";
import "../edit.css";

export const instant = false;

export default async function EditInvitationPage({ params }) {
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
        error,
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

    if (error || !invitation) {
        notFound();
    }

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

                    <div className="edit-header">

                        <div>
                            <span className="edit-status">
                                DRAFT
                            </span>

                            <h1>
                                {invitation.title}
                            </h1>

                            <p>
                                /i/{invitation.slug}
                            </p>
                        </div>

                    </div>

                    <div className="builder-layout">

                        <div className="builder-card">

                            <div className="builder-card-header">
                                <h2>
                                    Konten Undangan
                                </h2>

                                <p>
                                    Atur isi undangan kamu
                                    di sini.
                                </p>
                            </div>

                            <div className="builder-section-list">

                                <div className="builder-section">
                                    <div>
                                        <strong>
                                            Cover
                                        </strong>

                                        <span>
                                            Tampilan pembuka
                                            undangan
                                        </span>
                                    </div>

                                    <span className="section-badge">
                                        Segera
                                    </span>
                                </div>

                                <div className="builder-section">
                                    <div>
                                        <strong>
                                            Mempelai / Orang
                                        </strong>

                                        <span>
                                            Informasi orang
                                            dalam acara
                                        </span>
                                    </div>

                                    <span className="section-badge">
                                        Segera
                                    </span>
                                </div>

                                <div className="builder-section">
                                    <div>
                                        <strong>
                                            Acara
                                        </strong>

                                        <span>
                                            Tanggal dan waktu
                                            acara
                                        </span>
                                    </div>

                                    <span className="section-badge">
                                        Segera
                                    </span>
                                </div>

                                <div className="builder-section">
                                    <div>
                                        <strong>
                                            Lokasi
                                        </strong>

                                        <span>
                                            Tempat dan maps
                                        </span>
                                    </div>

                                    <span className="section-badge">
                                        Segera
                                    </span>
                                </div>

                                <div className="builder-section">
                                    <div>
                                        <strong>
                                            Galeri
                                        </strong>

                                        <span>
                                            Foto-foto acara
                                        </span>
                                    </div>

                                    <span className="section-badge">
                                        Segera
                                    </span>
                                </div>

                            </div>

                        </div>

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
                                    ID
                                </span>

                                <strong className="id-text">
                                    {invitation.id}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}