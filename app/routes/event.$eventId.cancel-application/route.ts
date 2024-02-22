import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { cancelEventApplication } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.eventId, "eventId not found");
    const userId = await requireUserId(request);
    const eventId = params.eventId;

    let message = "Nie aplikujesz juz na to wydarzenie";
    const response: TActionReturnData = { message, ok: true };

    await cancelEventApplication(userId, eventId).catch((e) => {
        console.error(e);
        response.ok = false;
        response.message = "Nie udało się odwołać aplikacji";
        return json(response, 500);
    });

    return json(response);
}

export type TJoinEventAction = typeof action;
