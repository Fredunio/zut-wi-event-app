import { Form, useNavigate } from "@remix-run/react";
import { Editor } from "@tinymce/tinymce-react";
import { Plus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { TAdminEvent } from "~/models/event.server";
import { dateToTime } from "~/utils";

const initialEditorValue = "<p>Opis Wydarzenia...</p>";

export default function EventForm({
    eventCategories,
    tags,
    TINY_API_KEY,
    edit = false,
    event,
}: {
    eventCategories: { name: string }[];
    tags: string[];
    TINY_API_KEY: string | undefined;
    edit?: boolean;
    event?: TAdminEvent;
}) {
    console.log("tags: ", event?.tags);
    console.log("event: ", event);

    const navigate = useNavigate();

    const editorRef = useRef<null | {
        getContent: () => string;
    }>(null);

    const [selectedTags, setSelectedTags] = useState<string[]>(
        event?.tags.map((tag) => tag.tagName) || []
    );
    const [tagInput, setTagInput] = useState<string>("");
    const [dateRange, setDateRange] = useState<boolean>(
        event?.dateTo ? true : false
    );
    const tagSelectRef = useRef<HTMLSelectElement>(null);

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

    const inEditMode = edit && event;

    return (
        <Form
            navigate={false}
            encType="multipart/form-data"
            method="post"
            action={
                inEditMode
                    ? `/dashboard/edit-event/${event?.id}`
                    : "/dashboard/add-event"
            }
            className="flex items-center flex-col w-full gap-8"
        >
            <label htmlFor="event-name" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Nazwa</span>
                </div>
                <input
                    id="event-name"
                    required={true}
                    type="text"
                    name="name"
                    defaultValue={inEditMode ? event.name : ""}
                    placeholder="Nowe wydarzenie"
                    className="input input-bordered w-full"
                />
            </label>
            <label htmlFor="event-category" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Kategoria</span>
                </div>
                <select
                    required={true}
                    name="categoryName"
                    defaultValue={inEditMode ? event.categoryName : ""}
                    id="event-category"
                    className="select select-bordered"
                >
                    <option disabled>Wybierz kategorię</option>
                    {eventCategories.map((category) => (
                        <option key={category.name}>{category.name}</option>
                    ))}
                </select>
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
                        required={true}
                        name="dateFrom"
                        id="event-date-from"
                        defaultValue={
                            inEditMode
                                ? new Date(event.dateFrom).toLocaleDateString(
                                      "en-Ca"
                                  )
                                : ""
                        }
                        type="date"
                        placeholder="Od..."
                        className="input input-bordered w-full "
                    />
                    <div>
                        <span className="label-text">
                            <label className="label justify-start gap-2 cursor-pointer">
                                <span className="label-text">Zakres dni</span>
                                <input
                                    onChange={(e) =>
                                        setDateRange(e.target.checked)
                                    }
                                    defaultValue={
                                        inEditMode && event.dateTo
                                            ? "true"
                                            : undefined
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
                        <span className="label-text">Od godziny </span>
                    </div>
                    <input
                        name="timeFrom"
                        id="event-time-from"
                        defaultValue={
                            inEditMode && event.timeFrom
                                ? dateToTime(event.timeFrom)
                                : undefined
                        }
                        type="time"
                        placeholder="Od..."
                        className="input input-bordered w-full "
                    />
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
                            name="dateTo"
                            id="event-date-to"
                            type="date"
                            defaultValue={
                                inEditMode && event.dateTo
                                    ? event.dateTo.toLocaleDateString("en-Ca")
                                    : undefined
                            }
                            placeholder="Do..."
                            className="input input-bordered w-full "
                        />
                    </label>

                    <label
                        htmlFor="event-time-to"
                        className="form-control w-full"
                    >
                        <div className="label">
                            <span className="label-text">Godzina do</span>
                        </div>
                        <input
                            defaultValue={
                                inEditMode && event.timeTo
                                    ? dateToTime(event.timeTo)
                                    : undefined
                            }
                            name="timeTo"
                            id="event-time-to"
                            type="time"
                            placeholder="Do..."
                            className="input input-bordered w-full "
                        />
                    </label>
                </div>
            )}

            <label htmlFor="event-location" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Lokacja</span>
                </div>
                <input
                    required={true}
                    name="location"
                    id="event-location"
                    defaultValue={inEditMode ? event.location : undefined}
                    type="text"
                    placeholder="Zut Wydział Informatyczny, budynek..."
                    className="input input-bordered w-full "
                />
            </label>
            <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Dołącz obraz</span>
                </div>
                <input
                    defaultValue={
                        inEditMode && event.image !== null
                            ? event.image
                            : undefined
                    }
                    name="image"
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full "
                />
            </label>
            <label htmlFor="event-info" className="form-control w-full">
                <div className="label">
                    <span className="label-text">Info</span>
                </div>
                <textarea
                    defaultValue={inEditMode ? event.info : undefined}
                    required={true}
                    name="info"
                    id="event-info"
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Krótka informacja na temat wydarzenia"
                ></textarea>
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
                    onEditorChange={(e) => {
                        // setValue('story', e)
                    }}
                    initialValue={inEditMode ? event.body : initialEditorValue}
                />
            </div>
            {/* TODO: zmienic na autocomplete select */}

            <label htmlFor="event-tag-input" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Tagi</span>
                </div>
                <div className="relative">
                    <input
                        // disabled={Boolean(tagSelectRef.current)}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        id="event-tag-input"
                        type="text"
                        placeholder="Dodaj tagi"
                        className="input input-bordered w-full"
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
                    <span className="label-text">Potrzebna rejestracja</span>
                    <input
                        value="true"
                        defaultChecked={inEditMode && event.needRegistration}
                        name="needRegistration"
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
                        defaultChecked={inEditMode && event.hidden}
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
                    type={inEditMode ? "button" : "reset"}
                    onClick={() => {
                        if (inEditMode) {
                            navigate(-1);
                        }
                    }}
                    className="btn btn-outline btn-error text-lg"
                >
                    {/* Reset */}
                    {inEditMode ? "Anuluj" : "Reset"}
                </button>
                <button
                    type="submit"
                    className="btn btn-primary text-lg font-semibold"
                >
                    {/* Dodaj */}
                    {inEditMode ? "Edytuj" : "Dodaj"}
                </button>
            </div>
        </Form>
    );
}
