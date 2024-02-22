import {
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowRight, Briefcase, CalendarDays } from "lucide-react";

import heroBg from "public/images/hero_bg.png";
import EventCard from "~/components/cards/EventCard";
import JobFairCard from "~/components/cards/JobFairCard";
import { getEventListItems } from "~/models/event.server";
import { getCurrentJobFair } from "~/models/jobFair.server";

export const meta: MetaFunction = () => [{ title: "Zut WI Events" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const events = await getEventListItems({ limit: 3 });
    const jobFair = await getCurrentJobFair();
    return json({
        events,
        jobFair,
    });
};

export default function Index() {
    // const user = useOptionalUser();
    const { events, jobFair } = useLoaderData<typeof loader>();

    return (
        <main>
            <div
                className="hero h-96"
                style={{
                    backgroundImage: `url(${heroBg})`,
                }}
            >
                <div className="hero-overlay bg-opacity-60 z-0"></div>
                <div className="hero-content z-10 text-center text-neutral-50">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">
                            Witaj w WI Events
                        </h1>
                        <p className="mb-5">
                            Provident cupiditate voluptatem et in. Quaerat
                            fugiat ut assumenda excepturi exercitationem quasi.
                            In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        {/* <button className="btn btn-primary">Get Started</button> */}
                    </div>
                </div>
            </div>

            <div className="container py-20 px-20 flex flex-col gap-24">
                <section>
                    <h2 className="text-3xl font-extrabold flex items-center gap-2 mb-12">
                        <span>Aktualne Wydarzenia</span>
                        <CalendarDays size={30} />
                        <Link
                            to="/events"
                            className="btn btn-sm  text-lg btn-accent  ml-auto"
                        >
                            Zobacz więcej
                            <ArrowRight />
                        </Link>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        {/* <EventCard />
                        <EventCard />
                        <EventCard /> */}
                        {events.map((event, i) => (
                            <EventCard event={event} key={event.id} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-extrabold flex items-center gap-2 mb-12">
                        <span>Aktualny Targ Pracy</span>
                        <Briefcase size={30} />
                        {/* <Link
                            to={jobFair ? "job-fair" : ""}
                            className="btn btn-sm text-lg btn-secondary btn-outline ml-auto"
                        >
                            Szczegóły
                            <ArrowRight />
                        </Link> */}
                    </h2>
                    <div className="flex">
                        {jobFair ? (
                            <JobFairCard jobFair={jobFair} className="w-full" />
                        ) : (
                            <div className="w-full bg-neutral-100 p-10 text-center text-neutral-500">
                                Aktualnie nie ma zaplanowanych targów pracy
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
