import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Editor } from "@tinymce/tinymce-react";
import React from "react";
import JobFairBooths from "~/components/JobFairBooths/JobFairBooths";
import { TBooth, getBoothListItems } from "~/models/booth.server";
import {
    getCurrentJobFair,
    getSponsorshipBenefits,
} from "~/models/jobFair.server";
import { commitSession, getSession, setToastMessage } from "~/session.server";
import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const jobFair = await getCurrentJobFair();
    if (!jobFair) {
        setToastMessage(
            session,
            "Aktualnie nie ma żadnych targów pracy. Sprawdź później."
        );
        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    const booths = await getBoothListItems();

    return json({
        booths,
        jobFair,
        TINY_API_KEY: process.env.TINY_API_KEY,
    });
}

export default function JobFair() {
    const { booths, jobFair, TINY_API_KEY } = useLoaderData<typeof loader>();
    const user = useOptionalUser();
    const editorRef = React.useRef<any>();
    return (
        <div className="mx-auto max-w-[1600px] flex flex-col gap-32 py-24 px-28 ">
            {/* <h1 className="text-5xl font-extrabold text-center mb-24">
                Targ Pracy
            </h1> */}

            <div className="h-full">
                <Editor
                    id="dreamStoryTiny"
                    init={{
                        menubar: false,
                        statusbar: false,
                        toolbar: false,
                        readonly: true,
                        plugins: "autoresize",
                        // inline: true,
                    }}
                    disabled
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    apiKey={TINY_API_KEY}
                    value={jobFair.body}
                    initialValue={jobFair.body}
                />
            </div>
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-16 text-center">
                    Układ Stoisk
                </h2>
                <JobFairBooths jobFair={jobFair} booths={booths} user={user} />
            </div>
        </div>
    );
}
