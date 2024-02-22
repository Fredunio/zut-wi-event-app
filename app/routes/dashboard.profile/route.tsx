import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserProfileForm from "~/components/forms/UserProfileForm";
import { getUserProfileById } from "~/models/user.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect("/login");
    }
    const userProfile = await getUserProfileById(userId);
    return json({ userProfile });
}

export default function DashboardProfile() {
    const { userProfile } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1 className="dashboard-section-headding">Profil</h1>
            <UserProfileForm userProfile={userProfile} />
        </div>
    );
}
