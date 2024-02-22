import { useUser } from "~/utils";

export default function DashboardHome() {
    const user = useUser();
    return (
        <div>
            <h1 className="dashboard-section-headding">
                Witaj
                <span className="text-primary"> {user.email}</span>!
            </h1>
        </div>
    );
}
