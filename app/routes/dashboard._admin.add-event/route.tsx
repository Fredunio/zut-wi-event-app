import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
    redirect,
} from "@remix-run/node";
import {
    commitSession,
    getSession,
    requireAdmin,
    setToastMessage,
} from "~/session.server";
import { createEvent, getEventCategories } from "~/models/event.server";
import { Editor } from "@tinymce/tinymce-react";
import { getTags } from "~/models/tag.server";
import { Plus, X } from "lucide-react";
import { ZodIssue, z } from "zod";
import { eventFormSchema } from "~/app-types";
import { getZodIssueMessage } from "~/utils";
import useInputRefs from "~/hooks/useInputRefs";

export const meta: MetaFunction = () => [{ title: "Dodaj Wydarzenie" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await requireAdmin(request);
    const eventCategories = await getEventCategories();
    const tags = await getTags();
    return json({
        TINY_API_KEY: process.env.TINY_API_KEY,
        eventCategories,
        tags,
    });
};

const initialEditorValue = "<p>Opis Wydarzenia...</p>";

export async function action({ request }: ActionFunctionArgs) {
    const admin = await requireAdmin(request);

    const session = await getSession(request);

    const formData = await request.formData();
    let values = Object.fromEntries(formData);

    console.log("form data values", values);

    console.log("tags[]", values["tags[]"]);

    const { "tags[]": tagsString, ...restValues } = values;
    let tags: { tagName: string }[] = [];

    if (typeof tagsString === "string") {
        tags = tagsString.split(",").map((tag) => ({ tagName: tag }));
    }

    console.log("tag array", tags);

    const parsedSchema = eventFormSchema.safeParse({ ...restValues, tags });
    if (!parsedSchema.success) {
        console.log("parsed schema", parsedSchema.error.issues);
        return json({ errors: parsedSchema.error.issues }, { status: 400 });
    }

    await createEvent({ ...parsedSchema.data });
    setToastMessage(session, "Wydarzenie zostało dodane");
    return redirect("/dashboard/admin/events", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function DashboardAdminAddEvent() {
    const editorRef = useRef<null | {
        getContent: () => string;
    }>(null);
    const { eventCategories, tags, TINY_API_KEY } =
        useLoaderData<typeof loader>();

    const actionData = useActionData<typeof action>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const [dateRange, setDateRange] = useState<boolean>(false);
    const tagSelectRef = useRef<HTMLSelectElement>(null);

    const { inputRefs, setInputRef } = useInputRefs();

    const addToSelectedTags = useCallback(() => {
        console.log("tag select ref current", tagSelectRef.current);
        if (selectedTags.includes(tagInput)) {
            return;
        }
        if (tagInput) {
            setSelectedTags((prev) => [...prev, tagInput]);
            setTagInput("");
        }
    }, [tagInput]);

    const deleteFromSelectedTags = useCallback(
        (tag: string) => {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
        },
        [selectedTags]
    );

    const errorsArray = actionData?.errors as ZodIssue[];
    const getErrorMessage = useCallback(
        (key: string) => {
            return getZodIssueMessage(errorsArray, key);
        },

        [actionData]
    );

    useEffect(() => {
        if (errorsArray) {
            errorsArray.forEach((error) => {
                const inputRef = inputRefs.current[error.path[0]];
                if (inputRef) {
                    inputRef.focus();
                    return;
                }
            });
        }
    }, [errorsArray]);

    return (
        <main className="container flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold mb-16">Dodaj Wydarzenie</h1>
            <Form
                navigate={false}
                encType="multipart/form-data"
                method="post"
                action="/dashboard/add-event"
                className="flex items-center flex-col w-full gap-8"
            >
                <label htmlFor="event-name" className="form-control w-full ">
                    <div className="label">
                        <span className="label-text">Nazwa</span>
                    </div>
                    <input
                        ref={(ref) => setInputRef("name", ref)}
                        id="event-name"
                        required={true}
                        type="text"
                        name="name"
                        placeholder="Nowe wydarzenie"
                        className="input input-bordered w-full "
                    />
                    <ErrorMessage message={getErrorMessage("name")} />
                </label>
                <label
                    htmlFor="event-time-from"
                    className="form-control w-full "
                >
                    <div className="label">
                        <span className="label-text">Kategoria</span>
                    </div>
                    <select
                        ref={(ref) => setInputRef("categoryName", ref)}
                        required={true}
                        name="categoryName"
                        id="event-time-from"
                        className="select select-bordered"
                    >
                        <option disabled>Wybierz kategorię</option>
                        {eventCategories.map((category) => (
                            <option key={category.name}>{category.name}</option>
                        ))}
                    </select>
                    <ErrorMessage message={getErrorMessage("categoryName")} />
                </label>

                <div className="flex items-start justify-between w-full gap-8">
                    <label
                        htmlFor="event-date-from"
                        className="form-control w-full "
                    >
                        <div className="label">
                            <span className="label-text">Data od</span>
                        </div>
                        <input
                            ref={(ref) => setInputRef("dateFrom", ref)}
                            required={true}
                            name="dateFrom"
                            id="event-date-from"
                            type="date"
                            placeholder="Od..."
                            className="input input-bordered w-full "
                        />
                        <ErrorMessage message={getErrorMessage("dateFrom")} />
                        <div>
                            <span className="label-text">
                                <label className="label justify-start gap-2 cursor-pointer">
                                    <span className="label-text">
                                        Zakres dni
                                    </span>
                                    <input
                                        onChange={(e) =>
                                            setDateRange(e.target.checked)
                                        }
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-primary"
                                    />
                                </label>
                            </span>
                        </div>
                    </label>

                    <label
                        htmlFor="event-time-from"
                        className="form-control w-full"
                    >
                        <div className="label">
                            <span className="label-text">Godzina od</span>
                        </div>
                        <input
                            ref={(ref) => setInputRef("timeFrom", ref)}
                            name="timeFrom"
                            id="event-time-from"
                            type="time"
                            placeholder="Od..."
                            className="input input-bordered w-full "
                        />
                        <ErrorMessage message={getErrorMessage("timeFrom")} />
                    </label>
                </div>
                {dateRange && (
                    <div className="flex items-start justify-between w-full gap-8">
                        <label
                            htmlFor="event-date-to"
                            className="form-control w-full"
                        >
                            <div className="label">
                                <span className="label-text">Data do</span>
                            </div>
                            <input
                                ref={(ref) => setInputRef("dateTo", ref)}
                                name="dateTo"
                                id="event-date-to"
                                type="date"
                                placeholder="Do..."
                                className="input input-bordered w-full "
                            />
                            <ErrorMessage message={getErrorMessage("dateTo")} />
                        </label>

                        <label
                            htmlFor="event-time-to"
                            className="form-control w-full"
                        >
                            <div className="label">
                                <span className="label-text">Godzina do</span>
                            </div>
                            <input
                                ref={(ref) => setInputRef("timeTo", ref)}
                                name="timeTo"
                                id="event-time-to"
                                type="time"
                                placeholder="Do..."
                                className="input input-bordered w-full "
                            />
                            <ErrorMessage message={getErrorMessage("timeTo")} />
                        </label>
                    </div>
                )}

                <label
                    htmlFor="event-location"
                    className="form-control w-full "
                >
                    <div className="label">
                        <span className="label-text">Lokacja</span>
                    </div>
                    <input
                        ref={(ref) => setInputRef("location", ref)}
                        required={true}
                        name="location"
                        id="event-location"
                        type="text"
                        placeholder="Zut Wydział Informatyczny, budynek..."
                        className="input input-bordered w-full "
                    />
                    <ErrorMessage message={getErrorMessage("location")} />
                </label>
                <label className="form-control w-full ">
                    <div className="label">
                        <span className="label-text">Dołącz obraz</span>
                    </div>
                    <input
                        ref={(ref) => setInputRef("image", ref)}
                        name="image"
                        type="file"
                        className="file-input file-input-bordered file-input-primary w-full "
                    />
                    <ErrorMessage message={getErrorMessage("image")} />
                </label>
                <label htmlFor="event-info" className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Info</span>
                    </div>
                    <textarea
                        ref={(ref) => setInputRef("info", ref)}
                        required={true}
                        name="info"
                        id="event-info"
                        className="textarea textarea-bordered h-24 w-full"
                        placeholder="Krótka informacja na temat wydarzenia"
                    ></textarea>
                    <ErrorMessage message={getErrorMessage("info")} />
                </label>
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Opis Wydarzenia</span>
                    </div>
                    <Editor
                        textareaName="body"
                        id="storyEditorTiny"
                        init={{
                            // skin: "oxide-dark",
                            // content_css: "dark",
                            statusbar: false,
                            plugins:
                                "preview searchreplace autolink autosave visualblocks visualchars fullscreen link pagebreak nonbreaking anchor insertdatetime advlist lists wordcount quickbars emoticons",
                            quickbars_insert_toolbar: false,
                            quickbars_image_toolbar: false,
                            a11y_advanced_options: true,
                            toolbar:
                                "undo redo |  blocks fontfamily fontsize forecolor | bold italic strikethrough | bullist numlist |  alignleft aligncenter alignright alignjustify | outdent indent",
                        }}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        apiKey={TINY_API_KEY}
                        initialValue={initialEditorValue}
                    />
                    <ErrorMessage message={getErrorMessage("body")} />
                </div>

                <label
                    htmlFor="event-tag-input"
                    className="form-control w-full "
                >
                    <div className="label">
                        <span className="label-text">Tagi</span>
                    </div>
                    <div className="relative">
                        <input
                            ref={(ref) => setInputRef("tags", ref)}
                            // disabled={Boolean(tagSelectRef.current)}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            id="event-tag-input"
                            type="text"
                            placeholder="Dodaj tagi"
                            className="input input-bordered w-full "
                        />
                        <button
                            onClick={addToSelectedTags}
                            type="button"
                            title="Dodaj"
                            className="btn btn-primary btn-sm btn-square  absolute top-1/2 right-3 transform -translate-y-1/2"
                        >
                            <Plus size={"20"} className="cursor-pointer" />
                        </button>
                    </div>
                    <ErrorMessage message={getErrorMessage("tags")} />
                </label>
                <div className="flex items-center justify-start -mt-6 w-full gap-2">
                    {selectedTags.map((tag) => (
                        <div
                            key={tag}
                            className="badge badge-accent badge-lg font-semibold gap-2"
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => deleteFromSelectedTags(tag)}
                                type="button"
                                title="Usuń"
                                className="flex items-center justify-center"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    name="tags[]"
                    value={selectedTags.join(",")}
                    hidden={true}
                    readOnly={true}
                />
                <div className="flex items-center justify-start gap-8 w-full">
                    <label
                        htmlFor="event-needs-registration"
                        className="label cursor-pointer gap-2"
                    >
                        <span className="label-text">
                            Potrzebna rejestracja
                        </span>
                        <input
                            value="true"
                            name="needsRegistration"
                            id="event-needs-registration"
                            type="checkbox"
                            className="checkbox checkbox-primary"
                        />
                    </label>
                    <label
                        htmlFor="event-is-hidden"
                        className="label cursor-pointer gap-2"
                    >
                        <span className="label-text">Wydarzenie ukryte</span>
                        <input
                            value="true"
                            name="hidden"
                            id="event-is-hidden"
                            type="checkbox"
                            className="checkbox checkbox-primary"
                        />
                    </label>
                </div>
                <div className="flex items-center justify-between w-full mt-12">
                    <button
                        type="reset"
                        className="btn btn-outline btn-error text-lg"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary text-lg font-semibold"
                    >
                        Dodaj
                    </button>
                </div>
            </Form>
        </main>
    );
}

function ErrorMessage({ message }: { message: string | null | undefined }) {
    if (!message) {
        return null;
    }
    return (
        <p className="pt-1 text-error" id="email-error">
            {message}
        </p>
    );
}
