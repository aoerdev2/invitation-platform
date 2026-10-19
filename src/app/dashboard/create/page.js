import Link from "next/link";

import { supabase } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import CreateInvitationForm from "@/components/CreateInvitationForm";

import "./create.css";

export const instant = false;

export default async function CreateInvitationPage({
    searchParams,
}) {
    const params = await searchParams;

    const eventTypeId = params?.event_type;
    const templateId = params?.template;

    /*
    |--------------------------------------------------------------------------
    | STEP 3 — BASIC INFO
    |--------------------------------------------------------------------------
    */

    if (eventTypeId && templateId) {
        const {
            data: eventType,
            error: eventTypeError,
        } = await supabase
            .from("event_types")
            .select("id, name, slug")
            .eq("id", eventTypeId)
            .single();

        const {
            data: template,
            error: templateError,
        } = await supabase
            .from("templates")
            .select("id, name, description")
            .eq("id", templateId)
            .single();

        if (eventTypeError || templateError) {
            return (
                <div className="dashboard">
                    <DashboardSidebar />

                    <main className="dashboard-main">
                        <div className="dashboard-topbar">
                            <div className="topbar-title">
                                Buat Undangan
                            </div>

                            <div className="admin-badge">
                                Admin
                            </div>
                        </div>

                        <div className="dashboard-content">
                            <div className="content-card">
                                <h2>
                                    Data tidak ditemukan
                                </h2>

                                <p>
                                    Jenis acara atau template
                                    tidak ditemukan.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }

        return (
            <div className="dashboard">
                <DashboardSidebar />

                <main className="dashboard-main">

                    <div className="dashboard-topbar">
                        <div className="topbar-title">
                            Buat Undangan
                        </div>

                        <div className="admin-badge">
                            Admin
                        </div>
                    </div>

                    <div className="dashboard-content">

                        <div className="page-heading">

                            <Link
                                href={`/dashboard/create?event_type=${eventTypeId}`}
                                className="back-link"
                            >
                                ← Ganti Template
                            </Link>

                            <h1>
                                Informasi Dasar
                            </h1>

                            <p>
                                Isi informasi dasar untuk
                                undangan kamu.
                            </p>

                        </div>

                        <div className="basic-layout">

                            <CreateInvitationForm
                                eventType={eventType}
                                template={template}
                            />

                            <div className="basic-preview-card">

                                <div className="basic-preview-image">

                                    <div className="basic-preview-placeholder">
                                        <span>
                                            Preview
                                        </span>

                                        <p>
                                            {template.name}
                                        </p>
                                    </div>

                                </div>

                                <div className="basic-preview-info">

                                    <span>
                                        TEMPLATE TERPILIH
                                    </span>

                                    <h3>
                                        {template.name}
                                    </h3>

                                    <p>
                                        {template.description}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 2 — TEMPLATE
    |--------------------------------------------------------------------------
    */

    if (eventTypeId) {
        const {
            data: eventType,
            error: eventTypeError,
        } = await supabase
            .from("event_types")
            .select("id, name, slug")
            .eq("id", eventTypeId)
            .single();

        const {
            data: templates,
            error: templateError,
        } = await supabase
            .from("templates")
            .select(
                "id, name, description, supported_event_types"
            )
            .eq("is_active", true);

        if (eventTypeError || templateError) {
            return (
                <div className="dashboard">
                    <DashboardSidebar />

                    <main className="dashboard-main">

                        <div className="dashboard-topbar">
                            <div className="topbar-title">
                                Buat Undangan
                            </div>

                            <div className="admin-badge">
                                Admin
                            </div>
                        </div>

                        <div className="dashboard-content">

                            <div className="content-card">
                                <h2>
                                    Gagal mengambil data
                                </h2>

                                <p>
                                    Silakan refresh halaman
                                    dan coba lagi.
                                </p>
                            </div>

                        </div>

                    </main>
                </div>
            );
        }

        const filteredTemplates =
            (templates || []).filter((template) => {
                const supported =
                    template.supported_event_types || [];

                return supported.includes(
                    eventType.slug
                );
            });

        return (
            <div className="dashboard">
                <DashboardSidebar />

                <main className="dashboard-main">

                    <div className="dashboard-topbar">
                        <div className="topbar-title">
                            Buat Undangan
                        </div>

                        <div className="admin-badge">
                            Admin
                        </div>
                    </div>

                    <div className="dashboard-content">

                        <div className="page-heading">

                            <Link
                                href="/dashboard/create"
                                className="back-link"
                            >
                                ← Kembali
                            </Link>

                            <h1>
                                Pilih Template
                            </h1>

                            <p>
                                Pilih desain untuk acara{" "}
                                <strong>
                                    {eventType.name}
                                </strong>
                            </p>

                        </div>

                        {filteredTemplates.length === 0 ? (

                            <div className="content-card">

                                <div className="empty-state">

                                    <h2>
                                        Belum ada template
                                    </h2>

                                    <p>
                                        Belum ada template yang
                                        tersedia untuk jenis
                                        acara ini.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="template-grid">

                                {filteredTemplates.map(
                                    (template) => (

                                        <Link
                                            key={template.id}
                                            href={`/dashboard/create?event_type=${eventType.id}&template=${template.id}`}
                                            className="template-card"
                                        >

                                            <div className="template-preview">

                                                <div className="template-preview-placeholder">

                                                    <span>
                                                        Preview
                                                    </span>

                                                    <p>
                                                        {template.name}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="template-info">

                                                <h3>
                                                    {template.name}
                                                </h3>

                                                <p>
                                                    {template.description}
                                                </p>

                                                <span className="template-select">
                                                    Pilih Template →
                                                </span>

                                            </div>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </main>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 1 — EVENT TYPE
    |--------------------------------------------------------------------------
    */

    const {
        data: eventTypes,
        error,
    } = await supabase
        .from("event_types")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("sort_order");

    if (error) {
        return (
            <div className="dashboard">
                <DashboardSidebar />

                <main className="dashboard-main">

                    <div className="dashboard-topbar">
                        <div className="topbar-title">
                            Buat Undangan
                        </div>

                        <div className="admin-badge">
                            Admin
                        </div>
                    </div>

                    <div className="dashboard-content">

                        <div className="content-card">
                            <h2>
                                Gagal mengambil jenis acara
                            </h2>

                            <p>
                                Silakan refresh halaman
                                dan coba lagi.
                            </p>
                        </div>

                    </div>

                </main>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <DashboardSidebar />

            <main className="dashboard-main">

                <div className="dashboard-topbar">
                    <div className="topbar-title">
                        Buat Undangan
                    </div>

                    <div className="admin-badge">
                        Admin
                    </div>
                </div>

                <div className="dashboard-content">

                    <div className="page-heading">

                        <h1>
                            Buat Undangan
                        </h1>

                        <p>
                            Pilih jenis acara untuk memulai
                            pembuatan undangan.
                        </p>

                    </div>

                    <div className="event-grid">

                        {(eventTypes || []).map(
                            (eventType) => (

                                <Link
                                    key={eventType.id}
                                    href={`/dashboard/create?event_type=${eventType.id}`}
                                    className="event-card"
                                >

                                    <div className="event-icon">
                                        →
                                    </div>

                                    <div className="event-info">

                                        <h3>
                                            {eventType.name}
                                        </h3>

                                        <p>
                                            Buat undangan{" "}
                                            {eventType.name.toLowerCase()}{" "}
                                            dengan mudah.
                                        </p>

                                    </div>

                                    <div className="event-arrow">
                                        →
                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                </div>

            </main>
        </div>
    );
}