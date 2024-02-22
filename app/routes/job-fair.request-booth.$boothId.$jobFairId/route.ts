import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import { cancelBoothRequest, requestBooth } from "~/models/booth.server";
import { requireUserId } from "~/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
    invariant(params.boothId, "boothId not found");
    invariant(params.jobFairId, "boothId not found");

    const userId = await requireUserId(request);
    const boothId = params.boothId;
    const jobFairId = params.jobFairId;
    let message = "";
    const response: TActionReturnData = { message, ok: true };

    const method = request.method;
    console.log("method", method);
    if (method === "POST") {
        const form = await request.formData();

        response.message = "Aplikowano na stanowisko";

        await requestBooth({
            boothId,
            jobFairId,
            userId,
        }).catch((e) => {
            console.error(e);
            response.ok = false;
            response.message = e.message;
            return json(response, 500);
        });

        return json(response);
    }

    if (method === "DELETE") {
        response.message = "Anulowano aplikację na stanowisko";

        await cancelBoothRequest({ boothId, jobFairId, userId }).catch((e) => {
            console.error(e);
            response.ok = false;
            response.message = e.message;
            return json(response, 500);
        });
        return json(response);
    }
}

export type TBoothRequestAction = typeof action;
