import React from "react";
import EventSearchbar from "../forms/EventSearchbar";

function EventListPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-8">
            <EventSearchbar />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {children}
            </div>
            {/* <EventList /> */}
        </div>
    );
}

export default EventListPageLayout;
