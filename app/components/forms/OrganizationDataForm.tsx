import { Form, useFetcher } from "@remix-run/react";
import React from "react";
import { TAppUser } from "~/models/user.server";

export default function OrganizationDataForm({ user }: { user: TAppUser }) {
    const organization = user.organization;
    if (!organization) {
        return null;
    }

    const fetcherer = useFetcher();
    const formDisabled =
        fetcherer.state === "loading" || fetcherer.state === "submitting";

    return (
        <fetcherer.Form method="PUT" className="flex flex-col gap-4">
            <label htmlFor="organization-name" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Nazwa Firmy</span>
                </div>
                <input
                    id="event-name"
                    required={true}
                    type="text"
                    name="name"
                    defaultValue={organization.name}
                    className="input input-bordered w-full"
                />
            </label>
            <label htmlFor="nip" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">NIP</span>
                </div>
                <input
                    id="nip"
                    required={true}
                    type="text"
                    name="nip"
                    defaultValue={organization.nip}
                    className="input input-bordered w-full"
                />
            </label>

            {/* <div>
                <label htmlFor="address">Adres firmy</label>
                <input
                    type="text"
                    id="fullAddress"
                    name="fullAddress"
                    required
                    defaultValue={organization.fullAddress}
                />
            </div> */}
            <label htmlFor="fullAddress" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Adres firmy</span>
                </div>
                <input
                    id="fullAddress"
                    required={true}
                    type="text"
                    name="fullAddress"
                    defaultValue={organization.fullAddress}
                    className="input input-bordered w-full"
                />
            </label>
            <div>
                <label htmlFor="postalCode" className="form-control w-full ">
                    <div className="label">
                        <span className="label-text">Kod pocztowy</span>
                    </div>
                    <input
                        id="postalCode"
                        required={true}
                        type="text"
                        name="postalCode"
                        defaultValue={organization.postalCode}
                        className="input input-bordered w-full"
                    />
                </label>

                <label htmlFor="city" className="form-control w-full ">
                    <div className="label">
                        <span className="label-text">Miasto</span>
                    </div>
                    <input
                        id="city"
                        required={true}
                        type="text"
                        name="city"
                        defaultValue={organization.city}
                        className="input input-bordered w-full"
                    />
                </label>
            </div>

            <label htmlFor="phone" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Telefon firmy</span>
                </div>
                <input
                    id="phone"
                    type="text"
                    name="phone"
                    defaultValue={organization.phone || undefined}
                    className="input input-bordered w-full"
                />
            </label>

            <label htmlFor="email" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Email firmy</span>
                </div>
                <input
                    id="email"
                    required={true}
                    type="email"
                    name="email"
                    defaultValue={organization.email}
                    className="input input-bordered w-full"
                />
            </label>

            <label htmlFor="website" className="form-control w-full ">
                <div className="label">
                    <span className="label-text">Strona internetowa firmy</span>
                </div>
                <input
                    id="website"
                    type="text"
                    name="website"
                    defaultValue={organization.website || undefined}
                    className="input input-bordered w-full"
                />
            </label>
            {/* <div>
                <label htmlFor="logo">Logo firmy</label>
                <input
                    type="file"
                    id="logo"
                    name="logo"
                    required
                    defaultValue={organization.logo}
                />
            </div> */}

            <div className="flex justify-between mt-6">
                <button
                    disabled={formDisabled}
                    className="btn btn-outline btn-error"
                    type="reset"
                >
                    Anuluj
                </button>
                <button
                    disabled={formDisabled}
                    className={`btn btn-success ${formDisabled && "loading"}`}
                    type="submit"
                >
                    Zapisz
                </button>
            </div>
        </fetcherer.Form>
    );
}
