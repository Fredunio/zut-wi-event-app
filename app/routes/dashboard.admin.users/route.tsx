import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Ban, Check, Delete, Edit, Trash } from "lucide-react";
import { getAllUsers } from "~/models/user.server";
import { requireAdmin } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await requireAdmin(request);
    const users = await getAllUsers();
    return json({
        users,
    });
};

export default function DashboardAdminUsers() {
    const { users } = useLoaderData<typeof loader>();

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Student</th>
                        <th>Rola</th>
                        <th>Zawieszony</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={user.id}>
                            <th>{i + 1}</th>
                            <td>
                                <Link
                                    to={`/dashboard/admin/users/${user.id}`}
                                    className="link text-lg"
                                >
                                    {user.email}
                                </Link>
                            </td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.isStudent ? <Check /> : ""}</td>
                            <td>{user.roleName}</td>
                            <td>{user.suspended}</td>
                            <td className="flex items-center gap-2">
                                <button
                                    title="Edytuj"
                                    type="button"
                                    className="btn btn-sm btn-outline btn-square btn-secondary"
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    title="Zablokuj"
                                    type="button"
                                    className="btn btn-sm btn-outline btn-square btn-warning"
                                >
                                    <Ban size={14} />
                                </button>
                                <button
                                    title="Usuń"
                                    type="button"
                                    className="btn btn-sm btn-outline btn-square btn-error"
                                >
                                    <Trash size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
