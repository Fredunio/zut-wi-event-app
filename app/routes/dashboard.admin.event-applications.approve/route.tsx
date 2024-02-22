import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { acceptUserEventApplicationRequest } from "~/models/event.server";
import { requireAdmin } from "~/session.server";

export async function action({ params, request, context }: ActionFunctionArgs) {
    let admin = await requireAdmin(request);
    let { searchParams } = new URL(request.url);
    let eventId = searchParams.get("eventId");
    let userId = searchParams.get("userId");

    invariant(eventId, "eventId not found");
    invariant(userId, "userId not found");

    const message = "Zatwierdzono użytkownika w wydarzeniu";

    const response: TActionReturnData = { message, ok: true };

    await acceptUserEventApplicationRequest(userId, eventId).catch((e: any) => {
        console.error(e);
        response.ok = false;
        response.message = "Nie udało się zatwierdzić użytkownika w wydarzeniu";
        return json(response, 500);
    });
    return json(response);
}
