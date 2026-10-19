import "./DashboardSidebar.css";

export default function DashboardSidebar() {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-logo">
                <span>✦</span>
                InviteCraft
            </div>

            <nav className="sidebar-nav">
                <a href="/dashboard">Dashboard</a>
                <a href="/dashboard/invitations">Undangan</a>
                <a href="/dashboard/create">Buat Undangan</a>
            </nav>
        </aside>
    );
}