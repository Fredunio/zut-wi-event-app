import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { changeBoothRequestStatus } from "~/models/booth.server";
import { acceptUserEventApplicationRequest } from "~/models/event.server";
import { requireAdmin } from "~/session.server";
import { isRequestStatus } from "~/utils";

export async function action({ params, request, context }: ActionFunctionArgs) {
    let admin = await requireAdmin(request);
    // let { searchParams } = new URL(request.url);
    // let eventId = searchParams.get("eventId");
    // let userId = searchParams.get("userId");
    const form = await request.formData();
    const boothRequestId = form.get("boothRequestId")?.toString();
    const newStatus = form.get("newStatus")?.toString();
    invariant(boothRequestId, "boothRequestId not found");
    invariant(newStatus, "newStatus not found");
    if (isRequestStatus(newStatus)) {
        const message = "Zmieniono status zgłoszenia";
        const response: TActionReturnData = { message, ok: true };
        await changeBoothRequestStatus({
            boothRequestId,
            status: newStatus,
        }).catch((e: any) => {
            console.error(e);
            response.ok = false;
            response.message = "Nie udało się zmienić statusu zgłoszenia";
            return json(response, 500);
        });
        return json(response);
    } else {
        const message = "Zły status zgłoszenia";
        const response: TActionReturnData = { message, ok: false };
        return json(response, 400);
    }
}
