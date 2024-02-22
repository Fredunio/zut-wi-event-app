import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { bookmarkEvent, unbookmarkEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.eventId, "eventId not found");
    const userId = await requireUserId(request);
    const eventId = params.eventId;
    let message = "";
    const response: TActionReturnData = { message, ok: true };

    const method = request.method;
    console.log("method", method);
    if (method === "POST") {
        response.message = "Zapisano Wydarzenie";
        await bookmarkEvent(userId, eventId).catch((e) => {
            console.error(e);
            response.ok = false;
            response.message = "Nie udało się zapisać wydarzenia";
            return json(response, 500);
        });
        console.log("response", response);
        return json(response);
    }

    if (method === "DELETE") {
        response.message = "Usunięto Wydarzenie z Zapisanych";

        await unbookmarkEvent(userId, eventId).catch((e) => {
            console.error(e);
            response.ok = false;
            response.message = "Nie udało się usunąć wydarzenia z zapisanych";
            return json(response, 500);
        });
        console.log("response", response);

        return json(response);
    }
}

export type TBookmarkEventAction = typeof action;
