export const DEFAULT_INVITATION_SECTIONS = [
    {
        section_key: "cover",
        enabled: true,
        sort_order: 1,
        settings: {},
    },
    {
        section_key: "people",
        enabled: true,
        sort_order: 2,
        settings: {},
    },
    {
        section_key: "event",
        enabled: true,
        sort_order: 3,
        settings: {},
    },
    {
        section_key: "location",
        enabled: true,
        sort_order: 4,
        settings: {},
    },
    {
        section_key: "countdown",
        enabled: true,
        sort_order: 5,
        settings: {},
    },
    {
        section_key: "gallery",
        enabled: true,
        sort_order: 6,
        settings: {},
    },
    {
        section_key: "speech",
        enabled: true,
        sort_order: 7,
        settings: {},
    },
    {
        section_key: "rsvp",
        enabled: true,
        sort_order: 8,
        settings: {},
    },
    {
        section_key: "messages",
        enabled: true,
        sort_order: 9,
        settings: {},
    },
    {
        section_key: "closing",
        enabled: true,
        sort_order: 10,
        settings: {},
    },
    {
        section_key: "music",
        enabled: true,
        sort_order: 11,
        settings: {},
    },
];

export function createDefaultInvitationSections(invitationId) {
    return DEFAULT_INVITATION_SECTIONS.map((section) => ({
        invitation_id: invitationId,
        section_key: section.section_key,
        enabled: section.enabled,
        sort_order: section.sort_order,
        settings: section.settings,
    }));
}