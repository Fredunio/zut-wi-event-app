import { Link, useFetcher } from "@remix-run/react";
import React, { useCallback, useState } from "react";
import { TBooth } from "~/models/booth.server";
import {
    parseDatabaseName,
    useOptionalOrganizationUser,
    useOptionalUser,
} from "~/utils";
import ImageCarousel from "../utils/ImageCarousel";
import { TJobFairListItem } from "~/models/jobFair.server";
import { TActionReturnData } from "~/app-types";
import { applicationsStatusMessages } from "~/lib/app-data";

export default function JobFairBooths({
    booths,
    jobFair,
}: {
    booths: TBooth[];
    jobFair: TJobFairListItem;
}) {
    const boothsMemo = React.useMemo(() => {
        return booths;
    }, [booths]);

    const getBoothByName = (name: string) => {
        if (!boothsMemo || boothsMemo.length === 0) {
            return null;
        }
        return boothsMemo.find((booth) => booth.name === name);
    };

    return (
        <div className="overflow-x-auto grid grid-[repeat(auto-fill,minmax(0,auto))] grid-cols-1 place-items-start ">
            <div className="top-row flex place-content-center place-items-center items-center justify-center">
                <div className="booth-room-wide-space border-b-[calc(var(--booth-room-border-width))]">
                    <div className="buidling-entry absolute w-28 h-16 border-[calc(var(--booth-room-border-width))] border-y-base-100 left-0 -bottom-[calc(var(--booth-room-border-width))] booth-room-border-color">
                        <p className="text-center font-semibold text-lg">
                            Wejście
                        </p>
                    </div>
                </div>
                <div className="booth-room booth-room-top border-r-0">
                    {/* <Booth
                        jobFair={jobFair}
                        
                        booth={getBoothByName("c/1")}
                        shape="square"
                        className="-bottom-9 right-4"
                    >
                        {parseDatabaseName(getBoothByName("c/1")?.name)}
                    </Booth> */}
                </div>
                <div className="booth-room booth-room-top">
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("11/3")}
                        shape="vertical"
                        className="bottom-6 left-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("11/3")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("11/2")}
                        shape="horizontal"
                        className="top-[2px] left-8"
                    >
                        {parseDatabaseName(getBoothByName("11/2")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("11/4")}
                        shape="horizontal"
                        className="bottom-[2px] left-[5.3rem]"
                    >
                        {parseDatabaseName(getBoothByName("11/4")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("11/1")}
                        shape="horizontal"
                        className="top-[2px] right-4"
                    >
                        {parseDatabaseName(getBoothByName("11/1")?.name)}
                    </Booth>
                </div>
                <div className="booth-room-space border-b-[calc(var(--booth-room-border-width))]">
                    {/* <Booth
                        
                        jobFair={jobFair}
                        booth={getBoothByName("c/2")}
                        shape="square"
                        className="-bottom-9 left-2"
                    >
                        {parseDatabaseName(getBoothByName("c/2")?.name)}
                    </Booth> */}
                    {/* <Booth
                        
                        jobFair={jobFair}
                        booth={getBoothByName("c/3")}
                        shape="square"
                        className="-bottom-9 left-20"
                    >
                        {parseDatabaseName(getBoothByName("c/3")?.name)}
                    </Booth> */}
                </div>
                <div className="booth-room-wide booth-room-top">
                    {/* <Booth
                        jobFair={jobFair}
                        
                        booth={getBoothByName("c/4")}
                        className="-bottom-16 left-20 w-14 h-10"
                    >
                        {parseDatabaseName(getBoothByName("c/4")?.name)}
                    </Booth> */}
                </div>
            </div>

            <div className="middle-row flex w-auto h-[4.125rem] "></div>
            <div className="bottom-row flex ">
                <div className="booth-room-wide booth-room-bottom">
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("h/1")}
                        shape="vertical"
                        className="top-6 left-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("h/1")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("h/2")}
                        shape="horizontal"
                        className="bottom-[2px] left-5"
                    >
                        {parseDatabaseName(getBoothByName("h/2")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("h/3")}
                        shape="horizontal"
                        className="bottom-[2px] right-5"
                    >
                        {parseDatabaseName(getBoothByName("h/3")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("h/4")}
                        shape="vertical"
                        className="top-6 right-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("h/4")?.name)}
                    </Booth>
                </div>
                <div className="booth-room-space border-t-[calc(var(--booth-room-border-width))]"></div>
                <div className="booth-room booth-room-bottom border-r-0">
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("17/1")}
                        shape="horizontal"
                        className="bottom-[2px] left-1"
                    >
                        {parseDatabaseName(getBoothByName("17/1")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("17/4")}
                        shape="horizontal"
                        className="top-[2px] right-[5.2rem]"
                    >
                        {parseDatabaseName(getBoothByName("17/4")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("17/2")}
                        shape="horizontal"
                        className="bottom-[2px] right-8"
                    >
                        {parseDatabaseName(getBoothByName("17/2")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("17/3")}
                        shape="vertical"
                        className="top-6 right-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("17/3")?.name)}
                    </Booth>
                </div>
                <div className="booth-room-wide booth-room-bottom border-r-0">
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("16/1")}
                        shape="horizontal"
                        className="bottom-[2px] left-4"
                    >
                        {parseDatabaseName(getBoothByName("16/1")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("16/4")}
                        shape="horizontal"
                        className="top-[2px] right-[6.5rem]"
                    >
                        {parseDatabaseName(getBoothByName("16/4")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("16/2")}
                        shape="horizontal"
                        className="bottom-[2px] right-10"
                    >
                        {parseDatabaseName(getBoothByName("16/2")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("16/3")}
                        shape="vertical"
                        className="top-6 right-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("16/3")?.name)}
                    </Booth>
                </div>
                <div className="booth-room booth-room-bottom">
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("15/1")}
                        shape="horizontal"
                        className="bottom-[2px] left-1"
                    >
                        {parseDatabaseName(getBoothByName("15/1")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("15/4")}
                        shape="horizontal"
                        className="top-[2px] right-[5.2rem]"
                    >
                        {parseDatabaseName(getBoothByName("15/4")?.name)}
                    </Booth>

                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("15/2")}
                        shape="horizontal"
                        className="bottom-[2px] right-8"
                    >
                        {parseDatabaseName(getBoothByName("15/2")?.name)}
                    </Booth>
                    <Booth
                        jobFair={jobFair}
                        booth={getBoothByName("15/3")}
                        shape="vertical"
                        className="top-6 right-[2px]"
                    >
                        {parseDatabaseName(getBoothByName("15/3")?.name)}
                    </Booth>
                </div>
            </div>
        </div>
    );
}

interface BoothProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    booth: TBooth | undefined | null;
    jobFair: TJobFairListItem;
    className?: string;
    shape?: "horizontal" | "vertical" | "square";
    children?: React.ReactNode;
}

function Booth({
    booth,
    jobFair,
    shape,
    className,
    children,
    ...restProps
}: BoothProps) {
    const organization = useOptionalOrganizationUser();

    const applicationStatusByLoggedInOrganisation =
        organization &&
        booth?.JobFairBoothApplication?.find((application) => {
            // console.log("application", application);
            return (
                application.userId === organization.id &&
                application.jobFairId === jobFair.id
            );
        })?.status;

    const reservedByAnotherOrganisationName =
        organization &&
        booth?.JobFairBoothApplication?.find(
            (application) =>
                application.userId !== organization.id &&
                application.jobFairId === jobFair.id &&
                application.status === "approved"
        )?.user.organization?.name;

    const reservedOrganizationName =
        !organization &&
        booth?.JobFairBoothApplication?.find(
            (application) =>
                application.jobFairId === jobFair.id &&
                application.status === "approved"
        )?.user.organization?.name;

    const baseClasses = `
    ${
        shape === "horizontal"
            ? "booth-horizontal"
            : shape === "vertical"
            ? "booth-vertical vertical-writing"
            : shape === "square" && "booth-square"
    }

    ${
        applicationStatusByLoggedInOrganisation === "approved"
            ? "booth-button-approved"
            : applicationStatusByLoggedInOrganisation === "pending"
            ? "booth-button-pending"
            : applicationStatusByLoggedInOrganisation === "rejected"
            ? "booth-button-rejected"
            : reservedByAnotherOrganisationName
            ? "booth-button-reserved"
            : reservedOrganizationName
            ? "booth-button-reserved-user"
            : "booth-button-available"
    }
    ${className}`;

    const handleClick = useCallback(() => {
        if (booth) {
            const dialogEl = document.getElementById(booth.id);
            if (dialogEl !== null && dialogEl instanceof HTMLDialogElement) {
                dialogEl.showModal();
            }
        }
    }, []);

    return (
        <>
            <button
                onClick={handleClick}
                type="button"
                className={baseClasses}
                {...restProps}
            >
                {children}
            </button>
            {organization ? (
                <BoothModalOrganization
                    reservedByAnotherOrganisationName={
                        reservedByAnotherOrganisationName
                    }
                    jobFair={jobFair}
                    booth={booth}
                />
            ) : (
                <BoothModal
                    reservedForOrganizationName={reservedOrganizationName}
                    booth={booth}
                    jobFair={jobFair}
                />
            )}
        </>
    );
}

function BoothModal({
    booth,
    jobFair,
    reservedForOrganizationName,
}: {
    booth: TBooth | undefined | null;
    jobFair?: TJobFairListItem;
    reservedForOrganizationName: string | null | undefined | false;
}) {
    if (!booth) {
        return null;
    }

    const user = useOptionalUser();

    if (reservedForOrganizationName) {
        console.log("reservedForOrganizationName", reservedForOrganizationName);
        console.log("type:", typeof reservedForOrganizationName === "string");
    }
    return (
        <dialog id={booth.id} className="modal">
            <div className="modal-box">
                <ImageCarousel images={booth.images} />

                <h3 className="font-bold text-2xl mt-8">
                    Stoisko {booth.name}
                </h3>
                <p className="py-4">{booth.info}</p>

                {!user && typeof reservedForOrganizationName !== "string" && (
                    <p>
                        Zainteresowany?{" "}
                        <Link
                            className="link"
                            to={
                                "/register?organization=true&redirectTo=/job-fair"
                            }
                        >
                            Zarejestruj się
                        </Link>{" "}
                        jako organizacja i aplikuj na to stoisko.
                    </p>
                )}
                {typeof reservedForOrganizationName === "string" && (
                    <p className="bg-info text-info-content rounded-md py-2 px-4 text-center text-lg ">
                        Zarezerwowane przez{" "}
                        <span className="font-bold">
                            {reservedForOrganizationName}
                        </span>
                    </p>
                )}
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>Zamknij</button>
            </form>
        </dialog>
    );
}

function BoothModalOrganization({
    booth,
    jobFair,
    reservedByAnotherOrganisationName,
}: {
    booth: TBooth | undefined | null;
    jobFair?: TJobFairListItem;
    reservedByAnotherOrganisationName: string | null | undefined | false;
}) {
    if (!booth) {
        return null;
    }
    const user = useOptionalOrganizationUser();
    const isOrganization = user?.isOrganization;
    const fetcherApply = useFetcher<TActionReturnData>({
        key: `apply-booth-${booth.id}`,
    });

    const fetcherCancel = useFetcher<TActionReturnData>({
        key: `cancel-booth-${booth.id}`,
    });

    const appliedToThisBooth =
        isOrganization &&
        jobFair &&
        booth.JobFairBoothApplication?.find(
            (application) =>
                application.userId === user.id &&
                application.jobFairId === jobFair.id
        )?.status;

    const [selectedPackage, setSelectedPackage] = useState<
        string | null | undefined
    >(null);

    const appliedToAnotherBooth =
        isOrganization &&
        jobFair &&
        jobFair?.JobFairBoothApplication?.some(
            (application) =>
                application.userId === user.id &&
                application.jobFairId === jobFair.id &&
                application.status !== "rejected"
        );

    if (reservedByAnotherOrganisationName) {
        console.log(
            "reservedByAnotherOrganisationName",
            reservedByAnotherOrganisationName
        );
    }
    return (
        <dialog id={booth.id} className="modal">
            <div className="modal-box">
                <ImageCarousel images={booth.images} />

                <h3 className="font-bold text-2xl mt-8">
                    Stoisko {booth.name}
                </h3>
                <p className="py-4">{booth.info}</p>
                {isOrganization && jobFair ? (
                    appliedToThisBooth ? (
                        appliedToThisBooth === "pending" ? (
                            <fetcherCancel.Form
                                method="DELETE"
                                action={`/job-fair/request-booth/${booth.id}/${jobFair.id}`}
                                className="flex flex-col space-y-4"
                            >
                                <button
                                    type="submit"
                                    className="group btn font-semibold text-lg w-full btn-warning btn-outline whitespace-nowrap "
                                >
                                    <span className="group-hover:hidden">
                                        {applicationsStatusMessages["pending"]}
                                    </span>
                                    <span className="group-hover:block hidden">
                                        Anuluj
                                    </span>
                                </button>
                            </fetcherCancel.Form>
                        ) : appliedToThisBooth === "approved" ? (
                            <p className="text-success text-lg">
                                Twój wniosek o to stoisko został zaakceptowany.
                            </p>
                        ) : appliedToThisBooth === "rejected" ? (
                            <p className="text-error text-lg">
                                Twój wniosek o to stoisko został odrzucony.
                            </p>
                        ) : null
                    ) : appliedToAnotherBooth ? (
                        <p className="text-error text-lg">
                            Nie możesz aplikować na więcej niż jedno stoisko na
                            te targi pracy.
                        </p>
                    ) : reservedByAnotherOrganisationName ? (
                        <p className="text-error text-lg text-center">
                            Zarezerwowane przez{" "}
                            <span className="font-semibold">
                                {reservedByAnotherOrganisationName}
                            </span>
                        </p>
                    ) : (
                        <fetcherApply.Form
                            method="POST"
                            action={`/job-fair/request-booth/${booth.id}/${jobFair.id}`}
                            className="flex flex-col items-start gap-4"
                        >
                            <p className="text-lg">
                                Pakiet sponsorski:{" "}
                                <span className="font-bold text-lg text-primary-500">
                                    {parseDatabaseName(
                                        booth.sponsorshipPackage?.name
                                    )}
                                </span>
                            </p>

                            <button
                                type="submit"
                                className="btn font-semibold text-lg w-full btn-primary whitespace-nowrap "
                            >
                                Aplikuj
                            </button>
                        </fetcherApply.Form>
                    )
                ) : (
                    <p>
                        Zainteresowany?{" "}
                        <Link
                            className="link"
                            to={
                                "/register?organization=true&redirectTo=/job-fair"
                            }
                        >
                            Zarejestruj się
                        </Link>{" "}
                        jako organizacja i aplikuj na to stoisko.
                    </p>
                )}
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>Zamknij</button>
            </form>
        </dialog>
    );
}
