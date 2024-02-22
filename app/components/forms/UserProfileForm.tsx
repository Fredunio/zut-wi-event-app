import { Form, Link } from "@remix-run/react";
import { AtSign, KeyRound, PenLine, Smartphone } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { TUserProfile } from "~/models/user.server";

export default function UserProfileForm({
    userProfile,
}: {
    userProfile: TUserProfile;
}) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    // const avatarInputPreview = URL.createObjectURL(
    //     avatarInputRef.current?.files?.[0]
    // );

    const avatarInputPreview = avatarInputRef.current?.value;

    console.log(avatarInputRef.current?.files?.[0]);

    const handleAvatarClick = () =>
        useCallback(() => {
            avatarInputRef.current?.click();
            console.log(avatarInputRef.current?.files?.[0]);
            console.log(avatarInputRef.current?.value);
        }, [avatarInputRef]);

    return (
        <Form
            navigate={false}
            encType="multipart/form-data"
            className="profile-form"
        >
            <label
                htmlFor="avatarProfile"
                className="sticky top-[calc(var(--header-height)+1rem)] h-min"
            >
                <div className="label">
                    <span className="label-text">Avatar</span>
                </div>

                <button
                    type="button"
                    className="btn btn-ghost rounded-full btn-sm w-36 h-36"
                    onClick={handleAvatarClick}
                >
                    <input
                        type="file"
                        name="avatar"
                        id="avatarProfile"
                        className="hidden"
                        ref={avatarInputRef}
                    />
                    {avatarInputPreview ? (
                        <div className="avatar">
                            <div className="w-36 rounded-full">
                                <img src={avatarInputPreview} alt="avatar" />
                            </div>
                        </div>
                    ) : userProfile.avatar ? (
                        <div className="avatar">
                            <div className="w-36 rounded-full">
                                <img src={userProfile.avatar} alt="avatar" />
                            </div>
                        </div>
                    ) : (
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-36">
                                <span className="text-3xl">
                                    {userProfile.email[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </button>
            </label>
            <div className="flex flex-col gap-4 w-full">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                    htmlFor="emailProfile"
                    className="form-control w-full relative"
                >
                    <div className="label">
                        <span className="label-text">Email</span>
                    </div>
                    <div className="relative">
                        <label
                            className="absolute top-1/2 left-1 transform -translate-y-1/2"
                            htmlFor="emailProfile"
                        >
                            <AtSign
                                size={"20"}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2"
                            />
                        </label>
                        <input
                            id="emailProfile"
                            type="email"
                            disabled={true}
                            name="_email"
                            defaultValue={userProfile.email}
                            className="input input-bordered w-full pl-12"
                        />
                    </div>
                </label>
                <label
                    htmlFor="emailStudentProfile"
                    className="form-control w-full relative"
                >
                    <div className="label">
                        <span className="label-text">Email Studenta</span>
                    </div>
                    <div className="relative flex w-full gap-4">
                        <label
                            className="absolute top-1/2 left-1 transform -translate-y-1/2"
                            htmlFor="emailStudentProfile"
                        >
                            <AtSign
                                size={"20"}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2"
                            />
                        </label>
                        <input
                            id="emailStudentProfile"
                            type="email"
                            name="studentEmail"
                            defaultValue={userProfile.studentEmail || undefined}
                            className="input input-bordered w-full pl-12"
                        />
                        <button className="btn btn-primary">
                            <span className="">Zweryfikuj</span>
                        </button>
                    </div>
                </label>
                <label
                    htmlFor="phoneProfile"
                    className="form-control w-full relative"
                >
                    <div className="label">
                        <span className="label-text">Numer Telefonu</span>
                    </div>
                    <div className="relative flex gap-4">
                        <label
                            className="absolute top-1/2 left-1 transform -translate-y-1/2"
                            htmlFor="phoneProfile"
                        >
                            <Smartphone
                                size={"20"}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2"
                            />
                        </label>
                        <input
                            id="phoneProfile"
                            type="tel"
                            name="phoneNumber"
                            defaultValue={userProfile.phoneNumber || undefined}
                            className="input input-bordered w-full pl-12"
                        />
                        <button className="btn btn-primary">
                            <span className="">Zweryfikuj</span>
                        </button>
                    </div>
                </label>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                    htmlFor="pwdProfile"
                    className="form-control w-full relative"
                >
                    <div className="label">
                        <span className="label-text">Hasło</span>
                    </div>
                    <div className="relative flex gap-4">
                        <label
                            className="absolute top-1/2 left-1 transform -translate-y-1/2"
                            htmlFor="pwdProfile"
                        >
                            <KeyRound
                                size={"20"}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2"
                            />
                        </label>
                        <input
                            id="pwdProfile"
                            type="password"
                            disabled={true}
                            name="_pwd"
                            defaultValue={"password"}
                            className="input input-bordered w-full pl-12"
                        />
                        <Link to="/change-password" className="btn btn-primary">
                            <span className="lg:inline hidden">
                                Zmień hasło
                            </span>
                            <PenLine className="lg:hidden block" />
                        </Link>
                    </div>
                </label>
                <div className="flex w-full justify-between mt-16">
                    <button
                        type="reset"
                        className="btn btn-error btn-outline font-semibold text-lg"
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success font-semibold text-lg"
                    >
                        Zapisz
                    </button>
                </div>
            </div>
        </Form>
    );
}
