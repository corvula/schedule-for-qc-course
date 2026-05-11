import { getClearOrCancelTitle, setDisableButton, setDisabledSaveButtonSemester } from './disableComponent';
import { CANCEL_BUTTON_TITLE, CLEAR_BUTTON_LABEL } from '../constants/translationLabels/formElements';
import i18n from '../i18n';

const semester = {
    id: 47,
    description: '1 2021- 2022',
    year: 2021,
    startDay: '01/09/2021',
    endDay: '30/12/2021',
    currentSemester: true,
    defaultSemester: true,
    disable: false,
    semester_days: ['FRIDAY'],
    semester_classes: [],
    semester_groups: [{ id: 52, title: '21 (201-Б)' }],
};
const selectedGroups = [{ id: 52, label: '21 (201-Б)' }];

describe('setDisableButton function', () => {
    it('should return false if pristine equal false', () => {
        const pristine = false;
        expect(setDisableButton(pristine, false, null)).toBeFalsy();
    });

    it('should return false if id equal 49', () => {
        const id = 49;
        expect(setDisableButton(true, false, id)).toBeFalsy();
    });

    it('should return true if pristine and submitting equal true, and id is undefined or null', () => {
        const pristine = true;
        const submitting = true;
        let id = null;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
        id = undefined;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
    });

    it('should return false when id is 0', () => {
        const pristine = true;
        const submitting = false;
        const id = 0;
        expect(setDisableButton(pristine, submitting, id)).toBeFalsy();
    });

    it('should return false when pristine is false regardless of id', () => {
        const pristine = false;
        const submitting = false;
        const id = null;
        expect(setDisableButton(pristine, submitting, id)).toBeFalsy();
    });

    it('should return false when ONLY pristine is false', () => {
        expect(setDisableButton(false, false, null)).toBeFalsy();
    });

    it('should return false when ONLY id is not nil', () => {
        const id = 5;
        expect(setDisableButton(true, false, id)).toBeFalsy();
    });

    it('should return true ONLY when both pristine is true AND id is nil', () => {
        expect(setDisableButton(true, false, null)).toBeTruthy();
        expect(setDisableButton(true, false, undefined)).toBeTruthy();
        expect(setDisableButton(false, false, null)).toBeFalsy();
        expect(setDisableButton(true, false, 0)).toBeFalsy();
    });
});

describe('getClearOrCancelTitle function', () => {
    it('should return clear_button_label if id equal undefined', () => {
        expect(getClearOrCancelTitle(undefined, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
    });

    it('should return cancel_button_title if id equal 49', () => {
        expect(getClearOrCancelTitle(49, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });

    it('should return cancel_button_title if id equal null', () => {
        expect(getClearOrCancelTitle(null, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });

    it('should return cancel_button_title if id equal 0', () => {
        expect(getClearOrCancelTitle(0, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });

    it('should return clear_button_label ONLY for strictly undefined, not for null or 0', () => {
        expect(getClearOrCancelTitle(undefined, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
        expect(getClearOrCancelTitle(null, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
        expect(getClearOrCancelTitle(0, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });

    it('should distinguish === undefined from !== undefined', () => {
        expect(getClearOrCancelTitle(undefined, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
        expect(getClearOrCancelTitle(1, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
        expect(getClearOrCancelTitle('', i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });
});

describe('setDisabledSaveButtonSemester function', () => {
    describe('pristine or submitting equal true', () => {
        let pristine = true;
        let submitting = false;

        it('should return true if semester is empty', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
        });

        it('should return true if semester id equals 0', () => {
            const semesterWithZeroId = { id: 0, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(true, false, semesterWithZeroId, selectedGroups)).toBeTruthy();
        });

        it('should return true if semester has groups and selectedGroups matches', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups)).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups)).toBeTruthy();
        });

        it('should return true if semester is null', () => {
            expect(setDisabledSaveButtonSemester(true, false, null, undefined)).toBeTruthy();
        });
    });

    describe('pristine and submitting equal false', () => {
        const pristine = false;
        const submitting = false;

        it('should return false if semester is empty or null', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeFalsy();
            expect(setDisabledSaveButtonSemester(pristine, submitting, null)).toBeFalsy();
        });

        it('should return false if semester_groups is empty', () => {
            const semesterWithoutGroups = { id: 40, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, [])).toBeFalsy();
        });

        it('should return false if a new group is added', () => {
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, [
                    ...selectedGroups,
                    { id: 82, label: '22 (204-A)' },
                ]),
            ).toBeFalsy();
        });

        it('should return false if selectedGroups matches semester_groups exactly', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups)).toBeFalsy();
        });
    });

    describe('Edge cases for setDisabledSaveButtonSemester', () => {
        it('should return true when semester is null and pristine is true', () => {
            const pristine = true;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, null, selectedGroups);
            expect(result).toBeTruthy();
        });

        it('should return false when semester is null and pristine and submitting are false', () => {
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, null, selectedGroups);
            expect(result).toBeFalsy();
        });

        it('should return false when selectedGroups is undefined', () => {
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, undefined);
            expect(result).toBeFalsy();
        });

        it('should return true when submitting is true and no group changes', () => {
            const pristine = false;
            const submitting = true;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups);
            expect(result).toBeTruthy();
        });

        it('should handle semester without semester_groups property', () => {
            const semesterWithoutGroups = { id: 50 };
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, selectedGroups);
            expect(result).toBeFalsy();
        });

        it('should return false when a group is deleted', () => {
            const semesterWithTwoGroups = {
                id: 100,
                semester_groups: [{ id: 52 }, { id: 82 }],
            };
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithTwoGroups, [{ id: 52 }]);
            expect(result).toBeFalsy();
        });

        it('should return false when a new group is added', () => {
            const semesterWithOneGroup = { id: 101, semester_groups: [{ id: 52 }] };
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithOneGroup, [
                { id: 52 },
                { id: 200 },
            ]);
            expect(result).toBeFalsy();
        });

        it('should return false when both semester_groups and selectedGroups are empty', () => {
            const emptyGroupSemester = { id: 103, semester_groups: [] };
            const pristine = false;
            const submitting = false;
            const result = setDisabledSaveButtonSemester(pristine, submitting, emptyGroupSemester, []);
            expect(result).toBeFalsy();
        });

        it('should return true when both pristine and submitting are true and no group changes', () => {
            const pristine = true;
            const submitting = true;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups);
            expect(result).toBeTruthy();
        });

        it('should return true when submitting true and groups match exactly', () => {
            const semesterOneGroup = { id: 102, semester_groups: [{ id: 52 }] };
            const sameGroups = [{ id: 52 }];
            const pristine = false;
            const submitting = true;
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterOneGroup, sameGroups);
            expect(result).toBeTruthy();
        });

        it('kills && to || mutant on semester check', () => {
            expect(setDisabledSaveButtonSemester(true, false, {})).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, false, {})).toBeFalsy();
        });

        it('kills semester.id removal mutant', () => {
            const semesterZeroId = { id: 0, semester_groups: [{ id: 52 }] };
            expect(setDisabledSaveButtonSemester(true, false, semesterZeroId, selectedGroups)).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, false, semesterZeroId, selectedGroups)).toBeFalsy();
        });

        it('kills pristine || submitting to && mutant in else branch', () => {
            expect(setDisabledSaveButtonSemester(true, false, null)).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, true, null)).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, false, null)).toBeFalsy();
        });

        it('kills pristine || submitting to && mutant in if branch', () => {
            const sameSemester = { id: 47, semester_groups: [{ id: 52 }] };
            const sameGroups = [{ id: 52 }];
            expect(setDisabledSaveButtonSemester(true, false, sameSemester, sameGroups)).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, true, sameSemester, sameGroups)).toBeTruthy();
            expect(setDisabledSaveButtonSemester(false, false, sameSemester, sameGroups)).toBeFalsy();
        });

        it('kills isEmpty semester_groups removal mutant', () => {
            const emptyGroupsSemester = { id: 10, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(true, false, emptyGroupsSemester, [])).toBeFalsy();
            expect(setDisabledSaveButtonSemester(false, true, emptyGroupsSemester, [])).toBeFalsy();
        });

        it('kills newGroups check mutant', () => {
            const oneSemester = { id: 10, semester_groups: [{ id: 52 }] };
            const withNewGroup = [{ id: 52 }, { id: 200 }];
            expect(setDisabledSaveButtonSemester(false, false, oneSemester, withNewGroup)).toBeFalsy();
            expect(setDisabledSaveButtonSemester(true, false, oneSemester, withNewGroup)).toBeFalsy();
        });

        it('kills deleteGroups check mutant', () => {
            const twoGroupsSemester = { id: 10, semester_groups: [{ id: 52 }, { id: 82 }] };
            const withDeletedGroup = [{ id: 52 }];
            expect(setDisabledSaveButtonSemester(false, false, twoGroupsSemester, withDeletedGroup)).toBeFalsy();
            expect(setDisabledSaveButtonSemester(true, false, twoGroupsSemester, withDeletedGroup)).toBeFalsy();
        });

        it('kills || to && mutant in isChosenGroup calculation', () => {
            const emptySemester = { id: 1, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(false, false, emptySemester, [])).toBeFalsy();
            const oneSemester = { id: 1, semester_groups: [{ id: 52 }] };
            expect(setDisabledSaveButtonSemester(false, false, oneSemester, [{ id: 52 }, { id: 99 }])).toBeFalsy();
            expect(setDisabledSaveButtonSemester(false, false, oneSemester, [])).toBeFalsy();
        });
    });
});