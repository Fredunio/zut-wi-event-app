import { EventTicket } from "@prisma/client";
import React from "react";
import { QrCode as QrCodeIcon } from "lucide-react";
import { useRef } from "react";
import QRCode from "react-qr-code";

export default function TicketCard({ ticket }: { ticket: EventTicket }) {
    console.log("ticket", ticket);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const openDialog = () => dialogRef.current?.showModal();
    const qrValue = ticket.eventId;

    return (
        <>
            <div className="card card-side bg-base-200 shadow-xl max-h-72 object-cover">
                <figure className="w-[50%] object-cover h-full">
                    <img
                        className="object-cover h-full"
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Movie"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title font-extrabold text-2xl">
                        {ticket.name}
                    </h2>
                    <p>{ticket.info}</p>
                    <div className="flex items-start flex-col justify-between">
                        <p>
                            <strong>Gdzie: </strong>Szczecin
                        </p>
                        <p>
                            <strong>Kiedy: </strong>20.05.2024
                        </p>
                        <p>
                            <strong>Godzina: </strong>14:00
                        </p>
                    </div>
                    <div className="card-actions justify-end mt-2">
                        <button
                            onClick={openDialog}
                            type="button"
                            className="btn btn-primary w-full text-lg gap-4"
                        >
                            Kod QR
                            <QrCodeIcon />
                        </button>
                    </div>
                </div>
            </div>

            <dialog ref={dialogRef} id={qrValue} className="modal">
                <div className="modal-box w-auto">
                    {/* TODO: fix qrCode */}
                    {/* <QRCode className="w-64 h-64" value={qrValue} /> */}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

// function ModalQrCode({ qrValue }: { qrValue: string }) {
//     return (
//         <dialog id={qrValue} className="modal">
//             <div className="modal-box">
//                 <QRCode value={qrValue} /> */
//             </div>
//             <form method="dialog" className="modal-backdrop">
//                 <button>close</button>
//             </form>
//         </dialog>
//     );
// }

// <dialog ref={dialogRef} id={qrValue} className="modal">
// <div className="modal-box w-auto">
//     {/* test */}
//     <QRCode className="w-64 h-64" value={qrValue} />
// </div>
// <form method="dialog" className="modal-backdrop">
//     <button>close</button>
// </form>
// </dialog>
