import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { applyForEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.eventId, "eventId not found");
    const userId = await requireUserId(request);
    const eventId = params.eventId;

    let message = "Aplikowano na wydarzenie";
    const response: TActionReturnData = { message, ok: true };

    await applyForEvent(userId, eventId).catch((e) => {
        console.error(e);
        response.message = "Nie udało się aplikować na wydarzenie";
        response.ok = false;
        return json(response, 500);
    });
    return json(response);
}

export type TJoinEventAction = typeof action;
