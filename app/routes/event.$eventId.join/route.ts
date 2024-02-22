import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { joinEvent } from "~/models/event.server";
import { getSession, requireUserId, setToastMessage } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.eventId, "eventId not found");
    const userId = await requireUserId(request);
    const session = await getSession(request);

    const eventId = params.eventId;
    const message = "Dołączono do wydarzenia";
    const response: TActionReturnData = { message, ok: true };

    await joinEvent(userId, eventId).catch((e: any) => {
        console.error(e);
        response.ok = false;
        response.message = "Nie udało się dołączyć do wydarzenia";
        return json(response, 500);
    });
    return json(response);
}

export type TJoinEventAction = typeof action;
