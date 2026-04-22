import {cardObjectHandler} from './cardObjectHandler';

describe('cardObjectHandler function', () => {
    const card = {
        lessonCardId: 12,
        hours: 2,
        subject: { id: 2 },
        type: 'lecture',
        subjectForSite: 'Алгебра',
        teacher: {
            id: 4,
            name: 'Іван',
            surname: 'Блажевський',
            patronymic: 'Іванович',
            position: 'доцент',
        },
        groups: [{ id: 12, title: '123' }],
        grouped: true,
    };
    const link = 'http://youtube.com'\;
    const semester = { id: 6 };

    it('should return correct values', () => {
        expect(cardObjectHandler(card, semester, link)).toEqual({
            id: card.lessonCardId,
            hours: card.hours,
            subject: { id: card.subject.id },
            lessonType: card.type,
            subjectForSite: card.subjectForSite,
            teacher: card.teacher,
            linkToMeeting: link,
            groups: card.groups,
            grouped: card.grouped,
            semester,
        });
    });

    it('should convert string-numeric values to numbers and preserve group info', () => {
        const stringCard = {
            lessonCardId: '0',
            hours: '5',
            subject: { id: '7' },
            type: 'seminar',
            subjectForSite: 'Геометрія',
            teacher: { id: 10, name: 'Марія' },
            groups: [],
            grouped: false,
        };

        expect(cardObjectHandler(stringCard, semester, link)).toEqual({
            id: 0,
            hours: 5,
            subject: { id: 7 },
            lessonType: 'seminar',
            subjectForSite: 'Геометрія',
            teacher: stringCard.teacher,
            linkToMeeting: link,
            groups: [],
            grouped: false,
            semester,
        });
    });

    it('should handle empty card object without throwing', () => {
        expect(cardObjectHandler({}, semester, link)).toEqual({
            id: 0,
            hours: 0,
            subject: { id: 0 },
            lessonType: undefined,
            subjectForSite: undefined,
            teacher: undefined,
            linkToMeeting: link,
            groups: [],
            grouped: undefined,
            semester,
        });
    });

    describe('Edge cases for cardObjectHandler', () => {
        it('should handle card with id=0', () => {
            const cardWithZeroId = {
                lessonCardId: 0,
                hours: 2,
                subject: { id: 1 },
                type: 'lecture',
                subjectForSite: 'Math',
                teacher: { id: 5 },
                groups: [],
                grouped: true,
            };
            const result = cardObjectHandler(cardWithZeroId, semester, link);
            expect(result.id).toBe(0);
            expect(result.hours).toBe(2);
        });

        it('should handle card with null id', () => {
            const cardWithNullId = {
                lessonCardId: null,
                hours: 3,
                subject: { id: 2 },
                type: 'seminar',
                teacher: { id: 6 },
                groups: [],
                grouped: false,
            };
            const result = cardObjectHandler(cardWithNullId, semester, link);
            expect(result.id).toBe(0);
        });

        it('should handle card with undefined id', () => {
            const cardWithUndefinedId = {
                lessonCardId: undefined,
                hours: 4,
                subject: { id: 3 },
                type: 'practice',
            };
            const result = cardObjectHandler(cardWithUndefinedId, semester, link);
            expect(result.id).toBe(0);
        });

        it('should handle null semester', () => {
            const nullSemester = null;
            const result = cardObjectHandler(card, nullSemester, link);
            expect(result.semester).toBe(null);
            expect(result.id).toBe(card.lessonCardId);
        });

        it('should handle card with null teacher', () => {
            const cardWithNullTeacher = {
                lessonCardId: 20,
                hours: 2,
                subject: { id: 4 },
                type: 'lecture',
                teacher: null,
                groups: [],
                grouped: true,
            };
            const result = cardObjectHandler(cardWithNullTeacher, semester, link);
            expect(result.teacher).toBe(null);
        });

        it('should handle card with null subject', () => {
            const cardWithNullSubject = {
                lessonCardId: 21,
                hours: 2,
                subject: null,
                type: 'lecture',
                teacher: { id: 7 },
                groups: [],
                grouped: true,
            };
            const result = cardObjectHandler(cardWithNullSubject, semester, link);
            expect(result.subject.id).toBe(0);
        });

        it('should handle null link parameter', () => {
            const nullLink = null;
            const result = cardObjectHandler(card, semester, nullLink);
            expect(result.linkToMeeting).toBe(null);
        });

        it('should convert string numeric id to number', () => {
            const cardWithStringId = {
                lessonCardId: '99',
                hours: 2,
                subject: { id: '6' },
                type: 'lecture',
                teacher: { id: 9 },
                groups: [],
                grouped: true,
            };
            const result = cardObjectHandler(cardWithStringId, semester, link);
            expect(result.id).toBe(99);
            expect(typeof result.id).toBe('number');
        });

        it('should preserve multiple groups', () => {
            const cardWithMultipleGroups = {
                lessonCardId: 23,
                hours: 2,
                subject: { id: 7 },
                type: 'lecture',
                teacher: { id: 11 },
                groups: [
                    { id: 10, title: 'Group A' },
                    { id: 11, title: 'Group B' },
                ],
                grouped: true,
            };
            const result = cardObjectHandler(cardWithMultipleGroups, semester, link);
            expect(result.groups).toHaveLength(2);
        });

        it('should handle card with null groups', () => {
            const cardWithNullGroups = {
                lessonCardId: 24,
                hours: 2,
                subject: { id: 8 },
                type: 'lecture',
                teacher: { id: 12 },
                groups: null,
                grouped: true,
            };
            const result = cardObjectHandler(cardWithNullGroups, semester, link);
            expect(result.groups).toEqual([]);
        });
    });
});
