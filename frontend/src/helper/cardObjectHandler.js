export const cardObjectHandler = (card = {}, semester, link) => {
    return {
        id: Number(card.lessonCardId ?? 0),
        hours: Number(card.hours ?? 0),
        subject: {
            id: Number(card.subject?.id ?? 0),
        },
        lessonType: card.type,
        subjectForSite: card.subjectForSite,
        teacher: card.teacher,
        linkToMeeting: link,
        groups: card.groups ?? [],
        grouped: card.grouped,
        semester,
    };
};
