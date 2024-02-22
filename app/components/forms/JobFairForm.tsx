import { Form, useActionData } from "@remix-run/react";
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useRef } from "react";
import { ZodIssue } from "zod";
import { ACCEPTED_IMAGE_MIME_TYPES } from "~/lib/app-data";
import { TJobFairAdmin } from "~/models/jobFair.server";
import { TJobFairAction } from "~/routes/dashboard._admin.add-job-fair/route";
import { dateToTime, getZodIssueMessage } from "~/utils";

const initialEditorValue = "<p>Opis Targu Pracy...</p>";

export default function JobFairForm({
    TINY_API_KEY,
    jobFair,
    editMode,
}: {
    TINY_API_KEY: string | undefined;
    jobFair?: TJobFairAdmin;
    editMode?: boolean;
}) {
    const editorRef = useRef<null | {
        getContent: () => string;
    }>(null);

    const actionData = useActionData<TJobFairAction>();
    const errorsArray = actionData?.errors as ZodIssue[] | undefined;
    console.log("test.error", actionData?.errors);

    const getErrorMessage = useCallback(
        (key: string) => {
            return getZodIssueMessage(errorsArray, key);
        },
        [actionData]
    );

    console.log("errorsArray", errorsArray);

    console.log(
        "errorMessages:",
        errorsArray?.map((e) => e.message)
    );

    console.log("iamge error", getErrorMessage("image"));
    console.log("iamge error 2", errorsArray?.[0].path[0]);

    return (
        <Form
            action={
                editMode && jobFair
                    ? `/dashboard/edit-job-fair/${jobFair?.id}`
                    : "/dashboard/add-job-fair"
            }
            encType="multipart/form-data"
            method="post"
            className="flex items-center flex-col w-full gap-8"
        >
            <label htmlFor="event-name" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Nazwa</span>
                </div>
                <input
                    id="event-name"
                    required={true}
                    defaultValue={jobFair?.name}
                    type="text"
                    name="name"
                    placeholder="Nowe wydarzenie"
                    className="input input-bordered w-full "
                />

                <DisplayError errorMessage={getErrorMessage("name")} />
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
                            jobFair?.dateFrom
                                ? new Date(jobFair.dateFrom).toLocaleDateString(
                                      "en-Ca"
                                  )
                                : undefined
                        }
                        type="date"
                        placeholder="Od..."
                        className="input input-bordered w-full "
                    />
                    <DisplayError errorMessage={getErrorMessage("dateFrom")} />
                </label>

                <label htmlFor="event-date-to" className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Data do</span>
                    </div>
                    <input
                        name="dateTo"
                        id="event-date-to"
                        type="date"
                        placeholder="Do..."
                        defaultValue={
                            jobFair?.dateTo
                                ? new Date(jobFair.dateTo).toLocaleDateString(
                                      "en-Ca"
                                  )
                                : undefined
                        }
                        className="input input-bordered w-full "
                    />
                    <DisplayError errorMessage={getErrorMessage("dateTo")} />
                </label>
            </div>

            <div className="flex items-start justify-between w-full gap-8">
                <label
                    htmlFor="event-time-from"
                    className="form-control w-full"
                >
                    <div className="label">
                        <span className="label-text">Godzina od</span>
                    </div>
                    <input
                        name="dailyTimeFrom"
                        id="event-time-from"
                        type="time"
                        placeholder="Od..."
                        defaultValue={
                            editMode && jobFair?.dailyTimeFrom
                                ? dateToTime(jobFair.dailyTimeFrom)
                                : undefined
                        }
                        className="input input-bordered w-full"
                    />
                    <DisplayError
                        errorMessage={getErrorMessage("dailyTimeFrom")}
                    />
                </label>

                <label htmlFor="event-time-to" className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Godzina do</span>
                    </div>
                    <input
                        name="dailyTimeTo"
                        id="event-time-to"
                        type="time"
                        defaultValue={
                            editMode && jobFair?.dailyTimeTo
                                ? dateToTime(jobFair.dailyTimeTo)
                                : undefined
                        }
                        placeholder="Do..."
                        className="input input-bordered w-full "
                    />
                    <DisplayError
                        errorMessage={getErrorMessage("dailyTimeTo")}
                    />
                </label>
            </div>

            <label htmlFor="event-location" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Lokacja</span>
                </div>
                <input
                    required={true}
                    name="location"
                    id="event-location"
                    type="text"
                    defaultValue={jobFair?.location}
                    placeholder="Zut Wydział Informatyczny, budynek..."
                    className="input input-bordered w-full "
                />
                <DisplayError errorMessage={getErrorMessage("location")} />
            </label>
            <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Dołącz obraz</span>
                </div>
                <input
                    name="image"
                    defaultValue={jobFair?.image || ""}
                    type="file"
                    accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                    className="file-input file-input-bordered file-input-primary w-full "
                />
                <DisplayError errorMessage={getErrorMessage("image")} />
            </label>
            <label htmlFor="event-info" className="form-control w-full">
                <div className="label">
                    <span className="label-text">Info</span>
                </div>
                <textarea
                    required={true}
                    name="info"
                    defaultValue={jobFair?.info}
                    id="event-info"
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Krótka informacja na temat wydarzenia"
                ></textarea>
                <DisplayError errorMessage={getErrorMessage("info")} />
            </label>
            <div className="form-control w-full">
                <div className="label">
                    <span className="label-text">Opis Targu</span>
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
                    initialValue={
                        jobFair?.body ? jobFair.body : initialEditorValue
                    }
                />
                <DisplayError errorMessage={getErrorMessage("body")} />
            </div>
            {/* TODO: zmienic na autocomplete select */}

            <div className="flex items-center justify-start gap-8 w-full">
                <label
                    htmlFor="event-is-hidden"
                    className="label cursor-pointer gap-2"
                >
                    <span className="label-text">Targ Pracy ukryty</span>
                    <input
                        value="true"
                        name="hidden"
                        id="event-is-hidden"
                        defaultChecked={jobFair?.hidden}
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
                    {editMode ? "Anuluj" : "Reset"}
                </button>
                <button
                    type="submit"
                    className="btn btn-primary text-lg font-semibold"
                >
                    {editMode ? "Zatwierdź" : "Dodaj"}
                </button>
            </div>
        </Form>
    );
}

function DisplayError({
    errorMessage,
}: {
    errorMessage: string | null | undefined;
}) {
    if (errorMessage) {
        return <p className="text-error">{errorMessage}</p>;
    }
}
