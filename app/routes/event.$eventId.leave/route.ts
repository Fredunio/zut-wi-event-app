import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { leaveEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.eventId, "eventId not found");
    const userId = await requireUserId(request);
    const eventId = params.eventId;
    const message = "Opuściłeś wydarzenie";
    const response: TActionReturnData = { message, ok: true };

    invariant(eventId, "eventId not found");

    console.log("eventId", eventId);

    await leaveEvent(userId, eventId).catch((e) => {
        console.error(e);
        response.ok = false;
        response.message = "Nie udało się opuścić wydarzenia";
        return json(response, 500);
    });

    return json(response);
}

export type TLeaveEventAction = typeof action;
