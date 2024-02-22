import { Form, Link } from "@remix-run/react";
import { Hash, Plus, Search } from "lucide-react";

export default function EventSearchbarAdmin() {
    return (
        <Form className="flex items-end  w-full gap-4">
            <div className="relative">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                    className="absolute top-1/2 left-1 transform -translate-y-1/2"
                    htmlFor="eventSearch"
                >
                    <Search
                        size={"20"}
                        className="absolute top-1/2 left-3 transform -translate-y-1/2"
                    />
                </label>
                <input
                    id="eventSearch"
                    type="text"
                    name="q"
                    placeholder="Szukaj"
                    className="input input-bordered w-full pl-12"
                />
            </div>

            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="view" className="form-control w-min">
                <div className="label">
                    <span className="label-text">Widoczność</span>
                </div>
                <select
                    name="view"
                    id="view"
                    title="Widok"
                    className="select input-bordered max-w-xs"
                >
                    <option value={"all"}>Wszystkie</option>
                    <option value="ended">Zakończone</option>
                    <option value="upcoming">Nadchodzące</option>
                </select>
            </label>
            <div className="divider divider-horizontal h-[3rem] self-end" />

            {/* TODO: zrobic autocomplete */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="categoryFilter" className="form-control w-min">
                <div className="label">
                    <span className="label-text">Kategoria</span>
                </div>
                <select
                    name="categoryFilter"
                    id="categoryFilter"
                    title="Widok"
                    className="select input-bordered max-w-xs"
                >
                    <option value={"all"}>Wszystkie</option>
                    <option value="ended">Test 1</option>
                    <option value="upcoming">Test 2</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tagi</span>
                </div>
                <div className="relative">
                    <Hash
                        size={"20"}
                        className="absolute top-1/2 left-3 transform -translate-y-1/2"
                    />
                    <input
                        type="text"
                        placeholder="Wyszukaj tagi"
                        className="input  input-bordered w-full max-w-64 pl-12"
                    />
                </div>
            </label>

            <Link
                to="/dashboard/add-event"
                type="button"
                className="btn btn-secondary text-lg ml-auto"
            >
                Stwórz
                <Plus strokeWidth={"3"} />
            </Link>
        </Form>
    );
}
