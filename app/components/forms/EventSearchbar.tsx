import { EventCategory } from "@prisma/client";
import { Form, useFetcher } from "@remix-run/react";
import { Hash, Plus, Search } from "lucide-react";

export default function EventSearchbar({
    tags,
}: {
    tags?: { tagName: string }[];
}) {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="GET" className="flex items-end  w-full gap-4">
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
                    <option value="all">Wszystkie</option>
                    <option value="ended">Zakończone</option>
                    <option value="upcoming">Nadchodzące</option>
                </select>
            </label>
            <div className="divider divider-horizontal h-[3rem] self-end" />

            {/* TODO: zrobic autocomplete */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
                        className="input input-bordered w-full max-w-64 pl-12"
                    />
                </div>
            </label>
        </fetcher.Form>
    );
}
