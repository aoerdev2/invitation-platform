"use client";

import { useEffect, useState } from "react";
import "./WeddingTemplate.css";

export default function WeddingTemplate({
    invitation,
    sections = [],
}) {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMusicControl, setShowMusicControl] = useState(false);

    const sectionEnabled = (key) => {
        const section = sections.find(
            (item) => item.section_key === key
        );

        return section ? section.enabled : true;
    };

    const musicSource =
        invitation?.music?.source_url ||
        "/music/wedding.mp3";

    /* =====================================================
       SCROLL MUSIC CONTROL
    ===================================================== */

    useEffect(() => {
        const handleScroll = () => {
            setShowMusicControl(window.scrollY > 120);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /* =====================================================
       LOCK BODY BEFORE INVITATION OPENED
    ===================================================== */

    useEffect(() => {
        if (!isOpened) {
            document.body.classList.add("invitation-locked");
        } else {
            document.body.classList.remove("invitation-locked");
        }

        return () => {
            document.body.classList.remove("invitation-locked");
        };
    }, [isOpened]);

    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    useEffect(() => {
        if (!isOpened) return;

        const elements = document.querySelectorAll(
            ".wedding-template .wedding-section, " +
            ".wedding-template .wedding-people-intro, " +
            ".wedding-template .wedding-couple-names, " +
            ".wedding-template .people-quote, " +
            ".wedding-template .people-divider-top, " +
            ".wedding-template .people-divider-bottom"
        );

        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px",
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    }, [isOpened]);

    /* =====================================================
       OPEN INVITATION
    ===================================================== */

    const handleOpenInvitation = () => {
        setIsOpened(true);

        setTimeout(() => {
            const audio = document.getElementById(
                "wedding-background-music"
            );

            if (!audio) return;

            audio
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => {
                    setIsPlaying(false);
                });
        }, 150);
    };

    /* =====================================================
       MUSIC
    ===================================================== */

    const toggleMusic = () => {
        const audio = document.getElementById(
            "wedding-background-music"
        );

        if (!audio) return;

        if (audio.paused) {
            audio
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => { });
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    /* =====================================================
       DATA
    ===================================================== */

    const title =
        invitation?.title ||
        "Pernikahan Budi & Ani";

    const groomName =
        invitation?.groom_name ||
        "Budi";

    const brideName =
        invitation?.bride_name ||
        "Ani";

    return (
        <div className="wedding-template">

            {/* MUSIC */}

            <audio
                id="wedding-background-music"
                src={musicSource}
                loop
                preload="auto"
            />

            {/* =================================================
                COVER
            ================================================= */}

            <section
                className={`wedding-cover ${isOpened ? "cover-opened" : ""
                    }`}
            >
                <div className="wedding-cover-overlay" />
                <div className="wedding-cover-glow" />

                <div className="wedding-cover-content">

                    <div className="wedding-cover-top">
                        <p className="wedding-eyebrow">
                            The Wedding Of
                        </p>
                    </div>

                    <div className="wedding-couple">
                        <h1>
                            {groomName}

                            <span>&amp;</span>

                            {brideName}
                        </h1>
                    </div>

                    <div className="wedding-cover-bottom">

                        <p className="wedding-date">
                            SAVE THE DATE
                        </p>

                        <button
                            type="button"
                            className="wedding-open-button"
                            onClick={handleOpenInvitation}
                        >
                            Buka Undangan

                            <span className="wedding-open-line" />
                        </button>

                    </div>
                </div>

                <div className="wedding-cover-scroll">
                    <span />
                    <small>SCROLL</small>
                </div>

            </section>

            {/* =================================================
                MUSIC CONTROL
            ================================================= */}

            <button
                type="button"
                className={`wedding-music-control ${showMusicControl ? "visible" : ""
                    } ${isPlaying ? "playing" : ""
                    }`}
                onClick={toggleMusic}
                aria-label={
                    isPlaying
                        ? "Matikan musik"
                        : "Putar musik"
                }
            >
                <span className="music-icon">
                    {isPlaying ? "♫" : "♪"}
                </span>

                <span className="music-ring" />
            </button>

            {/* =================================================
                CONTENT
            ================================================= */}

            {isOpened && (
                <main className="wedding-content">

                    {/* =================================================
                        PEOPLE
                    ================================================= */}

                    {sectionEnabled("people") && (
                        <section className="wedding-people">

                            <div className="people-content-inner">

                                <div className="people-divider-top">
                                    <span />
                                    <i />
                                    <span />
                                </div>

                                <div className="wedding-people-intro">

                                    <p className="wedding-section-label">
                                        Sugeng Rawuh
                                    </p>

                                    <h2>
                                        Dua Hati,
                                        <br />
                                        Satu Perjalanan
                                    </h2>

                                    <p>
                                        Dengan penuh rasa syukur dan
                                        bahagia, kami memperkenalkan
                                        dua insan yang akan mengikat
                                        janji dalam sebuah perjalanan
                                        baru.
                                    </p>

                                </div>

                                <div className="wedding-couple-names">

                                    <div className="wedding-person">

                                        <div className="wedding-person-photo">

                                            <div className="wedding-person-photo-inner">
                                                <span>B</span>
                                            </div>

                                        </div>

                                        <div className="wedding-person-info">

                                            <small>
                                                THE GROOM
                                            </small>

                                            <h2>
                                                {groomName}
                                            </h2>

                                            <p>
                                                Putra dari
                                                <br />
                                                Bapak &amp; Ibu
                                            </p>

                                        </div>

                                    </div>

                                    <div className="wedding-and">
                                        <span>&amp;</span>
                                    </div>

                                    <div className="wedding-person">

                                        <div className="wedding-person-photo">

                                            <div className="wedding-person-photo-inner">
                                                <span>A</span>
                                            </div>

                                        </div>

                                        <div className="wedding-person-info">

                                            <small>
                                                THE BRIDE
                                            </small>

                                            <h2>
                                                {brideName}
                                            </h2>

                                            <p>
                                                Putri dari
                                                <br />
                                                Bapak &amp; Ibu
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="people-quote">

                                    <span>“</span>

                                    <p>
                                        Dan di antara tanda-tanda
                                        kebesaran-Nya, Dia menciptakan
                                        untukmu pasangan hidup agar
                                        kamu menemukan ketenteraman
                                        di dalamnya.

                                        <br />

                                        <strong>
                                            QS. Ar-Rum : 21
                                        </strong>
                                    </p>

                                    <span>”</span>

                                </div>

                                <div className="people-divider-bottom">

                                    <span />

                                    <span className="people-divider-symbol">
                                        ✦
                                    </span>

                                    <span />

                                </div>

                            </div>

                        </section>
                    )}

                    {/* =================================================
                        EVENT
                    ================================================= */}

                    {sectionEnabled("event") && (
                        <section className="wedding-section wedding-event">

                            <div className="wedding-section-label">
                                Waktu &amp; Acara
                            </div>

                            <h2>
                                Hari Bahagia Kami
                            </h2>

                            <p>
                                Sabtu, 20 Desember 2026
                            </p>

                            <p>
                                Akad Nikah — 08.00 WIB
                            </p>

                            <p>
                                Resepsi — 11.00 WIB
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        LOCATION
                    ================================================= */}

                    {sectionEnabled("location") && (
                        <section className="wedding-section wedding-location">

                            <div className="wedding-section-label">
                                Lokasi
                            </div>

                            <h2>
                                Tempat Acara
                            </h2>

                            <p>
                                Gedung Pernikahan
                            </p>

                            <p>
                                Jl. Contoh Alamat No. 123
                            </p>

                            <p>
                                Indramayu, Jawa Barat
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        COUNTDOWN
                    ================================================= */}

                    {sectionEnabled("countdown") && (
                        <section className="wedding-section wedding-countdown">

                            <div className="wedding-section-label">
                                Menuju Hari Bahagia
                            </div>

                            <h2>
                                Countdown
                            </h2>

                            <p>
                                Kami menantikan kehadiran Anda
                                di hari istimewa kami.
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        GALLERY
                    ================================================= */}

                    {sectionEnabled("gallery") && (
                        <section className="wedding-section wedding-gallery">

                            <div className="wedding-section-label">
                                Gallery
                            </div>

                            <h2>
                                Our Moments
                            </h2>

                            <div className="wedding-gallery-grid">

                                <div className="wedding-gallery-item">
                                    Foto 01
                                </div>

                                <div className="wedding-gallery-item">
                                    Foto 02
                                </div>

                                <div className="wedding-gallery-item">
                                    Foto 03
                                </div>

                                <div className="wedding-gallery-item">
                                    Foto 04
                                </div>

                            </div>

                        </section>
                    )}

                    {/* =================================================
                        SPEECH
                    ================================================= */}

                    {sectionEnabled("speech") && (
                        <section className="wedding-section wedding-speech">

                            <div className="wedding-section-label">
                                Doa &amp; Harapan
                            </div>

                            <h2>
                                Sepenggal Kata
                            </h2>

                            <p>
                                Merupakan suatu kebahagiaan bagi kami
                                apabila Bapak/Ibu/Saudara/i berkenan
                                hadir dan memberikan doa restu.
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        RSVP
                    ================================================= */}

                    {sectionEnabled("rsvp") && (
                        <section className="wedding-section wedding-rsvp">

                            <div className="wedding-section-label">
                                RSVP
                            </div>

                            <h2>
                                Konfirmasi Kehadiran
                            </h2>

                            <p>
                                Mohon konfirmasi kehadiran Anda
                                melalui halaman RSVP.
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    {sectionEnabled("messages") && (
                        <section className="wedding-section wedding-messages">

                            <div className="wedding-section-label">
                                Ucapan
                            </div>

                            <h2>
                                Doa &amp; Ucapan
                            </h2>

                            <p>
                                Tinggalkan doa dan ucapan untuk
                                kedua mempelai.
                            </p>

                        </section>
                    )}

                    {/* =================================================
                        CLOSING
                    ================================================= */}

                    {sectionEnabled("closing") && (
                        <section className="wedding-section wedding-closing">

                            <div className="wedding-section-label">
                                Terima Kasih
                            </div>

                            <h2>
                                Sampai Jumpa
                            </h2>

                            <p>
                                Terima kasih atas doa dan kehadiran
                                Anda di hari bahagia kami.
                            </p>

                            <strong>
                                {groomName} &amp; {brideName}
                            </strong>

                        </section>
                    )}

                </main>
            )}
        </div>
    );
}