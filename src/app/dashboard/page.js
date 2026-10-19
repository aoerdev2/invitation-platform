import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import DashboardSidebar from "@/components/DashboardSidebar";
import "./dashboard.css";

export const instant = false;

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="dashboard">
            <DashboardSidebar />

            <main className="dashboard-main">

                <div className="dashboard-topbar">
                    <div className="topbar-title">
                        Dashboard
                    </div>

                    <div className="admin-badge">
                        Admin
                    </div>
                </div>

                <div className="dashboard-content">

                    <div className="page-heading">
                        <h1>Selamat datang 👋</h1>

                        <p>
                            Kelola semua undangan digital kamu dari satu tempat.
                        </p>
                    </div>

                    <div className="dashboard-stats">

                        <div className="stat-card primary">
                            <span className="stat-label">
                                Total Undangan
                            </span>

                            <div className="stat-value">
                                0
                            </div>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Undangan Draft
                            </span>

                            <div className="stat-value">
                                0
                            </div>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Undangan Published
                            </span>

                            <div className="stat-value">
                                0
                            </div>
                        </div>

                    </div>

                    <div className="dashboard-section">

                        <h2 className="section-title">
                            Aksi Cepat
                        </h2>

                        <div className="quick-actions">

                            <Link
                                href="/dashboard/create"
                                className="quick-action"
                            >
                                <div className="quick-action-content">
                                    <strong>
                                        Buat Undangan Baru
                                    </strong>

                                    <span>
                                        Mulai membuat undangan digital
                                    </span>
                                </div>

                                <div className="quick-action-arrow">
                                    →
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/invitations"
                                className="quick-action"
                            >
                                <div className="quick-action-content">
                                    <strong>
                                        Kelola Undangan
                                    </strong>

                                    <span>
                                        Lihat dan kelola semua undangan
                                    </span>
                                </div>

                                <div className="quick-action-arrow">
                                    →
                                </div>
                            </Link>

                        </div>

                    </div>

                    <div className="content-card">

                        <h2>
                            InviteCraft
                        </h2>

                        <p>
                            Login sebagai
                        </p>

                        <strong>
                            {user.email}
                        </strong>

                    </div>

                </div>

            </main>
        </div>
    );
}