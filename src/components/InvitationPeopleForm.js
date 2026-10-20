"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import "./InvitationPeopleForm.css";

export default function InvitationPeopleForm({
    invitationId,
}) {
    const [groom, setGroom] = useState({
        id: null,
        name: "",
        description: "",
        photo: null,
    });

    const [bride, setBride] = useState({
        id: null,
        name: "",
        description: "",
        photo: null,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({
        groom: false,
        bride: false,
    });

    const [message, setMessage] = useState("");

    const groomFileRef = useRef(null);
    const brideFileRef = useRef(null);

    useEffect(() => {
        if (!invitationId) return;

        loadPeople();
    }, [invitationId]);

    async function loadPeople() {
        setLoading(true);
        setMessage("");

        const { data, error } = await supabase
            .from("invitation_people")
            .select(
                "id, name, role, photo, description, sort_order"
            )
            .eq("invitation_id", invitationId)
            .order("sort_order", {
                ascending: true,
            });

        if (error) {
            console.error(error);

            setMessage(
                "Gagal mengambil data mempelai."
            );

            setLoading(false);
            return;
        }

        const groomData = data?.find(
            (person) => person.role === "groom"
        );

        const brideData = data?.find(
            (person) => person.role === "bride"
        );

        if (groomData) {
            setGroom({
                id: groomData.id,
                name: groomData.name || "",
                description:
                    groomData.description || "",
                photo: groomData.photo || null,
            });
        }

        if (brideData) {
            setBride({
                id: brideData.id,
                name: brideData.name || "",
                description:
                    brideData.description || "",
                photo: brideData.photo || null,
            });
        }

        setLoading(false);
    }

    function updateGroom(field, value) {
        setGroom((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateBride(field, value) {
        setBride((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function uploadPhoto(file, role) {
        if (!file) return;
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        console.log("=== UPLOAD AUTH CHECK ===");
        console.log("SESSION ADA:", !!session);
        console.log("USER:", session?.user?.email);
        console.log("SESSION ERROR:", sessionError);
        console.log("=========================");
        if (!file.type.startsWith("image/")) {
            setMessage("File harus berupa gambar.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setMessage("Ukuran foto maksimal 5 MB.");
            return;
        }

        setMessage("");

        setUploading((current) => ({
            ...current,
            [role]: true,
        }));

        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                throw sessionError;
            }

            if (!session) {
                throw new Error(
                    "Session login tidak ditemukan. Silakan login ulang."
                );
            }

            const extension =
                file.name.split(".").pop()?.toLowerCase() || "jpg";

            const filePath =
                `${invitationId}/${role}/photo-${Date.now()}.${extension}`;

            const { error: uploadError } =
                await supabase.storage
                    .from("invitations")
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: true,
                    });

            if (uploadError) {
                throw uploadError;
            }

            const {
                data: publicUrlData,
            } = supabase.storage
                .from("invitations")
                .getPublicUrl(filePath);

            const photoUrl = publicUrlData.publicUrl;

            console.log("PHOTO URL:", photoUrl);

            const person =
                role === "groom"
                    ? groom
                    : bride;

            if (!person.id) {
                throw new Error(
                    "ID data mempelai tidak ditemukan. Simpan data mempelai terlebih dahulu."
                );
            }

            const { data: updatedPerson, error: updateError } =
                await supabase
                    .from("invitation_people")
                    .update({
                        photo: photoUrl,
                    })
                    .eq("id", person.id)
                    .eq("invitation_id", invitationId)
                    .select("id, photo")
                    .single();

            if (updateError) {
                throw updateError;
            }

            console.log("PHOTO DB:", updatedPerson);

            if (role === "groom") {
                setGroom((current) => ({
                    ...current,
                    photo: updatedPerson.photo,
                }));
            }

            if (role === "bride") {
                setBride((current) => ({
                    ...current,
                    photo: updatedPerson.photo,
                }));
            }

            setMessage(
                `Foto ${role === "groom"
                    ? "mempelai pria"
                    : "mempelai wanita"
                } berhasil disimpan.`
            );
        } catch (error) {
            console.error("UPLOAD PHOTO ERROR:", error);

            setMessage(
                error?.message ||
                "Gagal mengupload foto."
            );
        } finally {
            setUploading((current) => ({
                ...current,
                [role]: false,
            }));
        }
    }

    function handleFileChange(event, role) {
        const file =
            event.target.files?.[0];

        if (!file) return;

        uploadPhoto(file, role);

        event.target.value = "";
    }

    async function savePerson(
        person,
        role,
        sortOrder
    ) {
        const payload = {
            invitation_id: invitationId,
            name: person.name.trim(),
            role,
            photo: person.photo || null,
            description:
                person.description.trim() || null,
            sort_order: sortOrder,
        };

        if (person.id) {
            const { data, error } = await supabase
                .from("invitation_people")
                .update(payload)
                .eq("id", person.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        }

        const { data, error } = await supabase
            .from("invitation_people")
            .insert(payload)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async function handleSave(event) {
        event.preventDefault();

        setMessage("");

        if (!groom.name.trim()) {
            setMessage(
                "Nama mempelai pria wajib diisi."
            );
            return;
        }

        if (!bride.name.trim()) {
            setMessage(
                "Nama mempelai wanita wajib diisi."
            );
            return;
        }

        setSaving(true);

        try {
            const savedGroom =
                await savePerson(
                    groom,
                    "groom",
                    1
                );

            const savedBride =
                await savePerson(
                    bride,
                    "bride",
                    2
                );

            setGroom((current) => ({
                ...current,
                id: savedGroom.id,
                photo:
                    savedGroom.photo ||
                    current.photo,
            }));

            setBride((current) => ({
                ...current,
                id: savedBride.id,
                photo:
                    savedBride.photo ||
                    current.photo,
            }));

            setMessage(
                "Data mempelai berhasil disimpan."
            );
        } catch (error) {
            console.error(error);

            setMessage(
                error?.message ||
                "Gagal menyimpan data mempelai."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="people-form-loading">
                Memuat data mempelai...
            </div>
        );
    }

    return (
        <form
            className="people-form"
            onSubmit={handleSave}
        >
            <div className="people-form-header">
                <div>
                    <span className="people-form-eyebrow">
                        Data Undangan
                    </span>

                    <h2>
                        Data Mempelai
                    </h2>

                    <p>
                        Masukkan informasi kedua mempelai
                        yang akan ditampilkan pada undangan.
                    </p>
                </div>
            </div>

            <div className="people-form-grid">

                {/* =========================
                    GROOM
                ========================== */}

                <div className="people-form-card">

                    <div className="people-form-card-heading">
                        <span className="people-form-number">
                            01
                        </span>

                        <div>
                            <span>
                                THE GROOM
                            </span>

                            <h3>
                                Mempelai Pria
                            </h3>
                        </div>
                    </div>

                    <div className="people-photo-upload">

                        <div className="people-photo-preview">

                            {groom.photo ? (
                                <img
                                    src={groom.photo}
                                    alt="Foto mempelai pria"
                                />
                            ) : (
                                <span>
                                    G
                                </span>
                            )}

                        </div>

                        <div className="people-photo-actions">

                            <strong>
                                Foto Mempelai
                            </strong>

                            <small>
                                JPG, PNG atau WEBP · Maks. 5 MB
                            </small>

                            <input
                                ref={groomFileRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) =>
                                    handleFileChange(
                                        event,
                                        "groom"
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="people-photo-button"
                                onClick={() =>
                                    groomFileRef.current?.click()
                                }
                                disabled={
                                    uploading.groom
                                }
                            >
                                {uploading.groom
                                    ? "Mengupload..."
                                    : groom.photo
                                        ? "Ganti Foto"
                                        : "Pilih Foto"}
                            </button>

                        </div>

                    </div>

                    <div className="people-form-field">
                        <label htmlFor="groom-name">
                            Nama
                        </label>

                        <input
                            id="groom-name"
                            type="text"
                            value={groom.name}
                            onChange={(event) =>
                                updateGroom(
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="Contoh: Budi"
                        />
                    </div>

                    <div className="people-form-field">
                        <label htmlFor="groom-description">
                            Deskripsi
                        </label>

                        <textarea
                            id="groom-description"
                            value={groom.description}
                            onChange={(event) =>
                                updateGroom(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Contoh: Putra dari Bapak Ahmad & Ibu Siti"
                            rows={4}
                        />
                    </div>

                </div>


                {/* =========================
                    BRIDE
                ========================== */}

                <div className="people-form-card">

                    <div className="people-form-card-heading">
                        <span className="people-form-number">
                            02
                        </span>

                        <div>
                            <span>
                                THE BRIDE
                            </span>

                            <h3>
                                Mempelai Wanita
                            </h3>
                        </div>
                    </div>

                    <div className="people-photo-upload">

                        <div className="people-photo-preview">

                            {bride.photo ? (
                                <img
                                    src={bride.photo}
                                    alt="Foto mempelai wanita"
                                />
                            ) : (
                                <span>
                                    B
                                </span>
                            )}

                        </div>

                        <div className="people-photo-actions">

                            <strong>
                                Foto Mempelai
                            </strong>

                            <small>
                                JPG, PNG atau WEBP · Maks. 5 MB
                            </small>

                            <input
                                ref={brideFileRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) =>
                                    handleFileChange(
                                        event,
                                        "bride"
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="people-photo-button"
                                onClick={() =>
                                    brideFileRef.current?.click()
                                }
                                disabled={
                                    uploading.bride
                                }
                            >
                                {uploading.bride
                                    ? "Mengupload..."
                                    : bride.photo
                                        ? "Ganti Foto"
                                        : "Pilih Foto"}
                            </button>

                        </div>

                    </div>

                    <div className="people-form-field">
                        <label htmlFor="bride-name">
                            Nama
                        </label>

                        <input
                            id="bride-name"
                            type="text"
                            value={bride.name}
                            onChange={(event) =>
                                updateBride(
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="Contoh: Ani"
                        />
                    </div>

                    <div className="people-form-field">
                        <label htmlFor="bride-description">
                            Deskripsi
                        </label>

                        <textarea
                            id="bride-description"
                            value={bride.description}
                            onChange={(event) =>
                                updateBride(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Contoh: Putri dari Bapak Joko & Ibu Rina"
                            rows={4}
                        />
                    </div>

                </div>

            </div>


            <div className="people-form-footer">

                {message && (
                    <div className="people-form-message">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="people-form-save"
                    disabled={
                        saving ||
                        uploading.groom ||
                        uploading.bride
                    }
                >
                    {saving
                        ? "Menyimpan..."
                        : "Simpan Data Mempelai"}
                </button>

            </div>

        </form>
    );
}