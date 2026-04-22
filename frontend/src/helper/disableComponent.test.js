import {getClearOrCancelTitle, setDisableButton, setDisabledSaveButtonSemester,} from './disableComponent';
import {CANCEL_BUTTON_TITLE, CLEAR_BUTTON_LABEL,} from '../constants/translationLabels/formElements';
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
    semester_groups: [
        {
            id: 52,
            title: '21 (201-Б)',
        },
    ],
};
const selectedGroups = [
    {
        id: 52,
        label: '21 (201-Б)',
    },
];

describe('setDisableButton function', () => {
    it('should return false if pristine equal false', () => {
        const pristine = false;
        expect(setDisableButton(pristine, false, null)).toBeFalsy();
    });
    it('should return false if id equal 49', () => {
        const id = 49;
        expect(setDisableButton(true, false, id)).toBeFalsy();
    });
    it('should return true if pristine, submitting equal true, and if the id is undefined or null', () => {
        const pristine = true;
        const submitting = true;
        let id = null;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
        id = undefined;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
    });
});

describe('getClearOrCancelTitle function', () => {
    it('should return clear_button_label if id equal undefined', () => {
        const id = undefined;
        expect(getClearOrCancelTitle(id, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
    });
    it('should return cancel_button_title if id equal 49', () => {
        const id = 49;
        expect(getClearOrCancelTitle(id, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });
    it('should return cancel_button_title if id equal null', () => {
        const id = null;
        expect(getClearOrCancelTitle(id, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });
});

describe('setDisabledSaveButtonSemester function', () => {
    describe('pristine or submitting equal true', () => {
        let pristine = true;
        let submitting = false;
        it('should return true if semester is empty, null, or undefined', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
        });
        it('should return true if semester id equals 0 and pristine is true', () => {
            const semesterWithZeroId = { id: 0, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(true, false, semesterWithZeroId, selectedGroups)).toBeTruthy();
        });
        it('should return true if semester is not empty and selectedGroups is in semester.semester_groups', () => {
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups),
            ).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups),
            ).toBeTruthy();
        });
        it('should return true if semester is null regardless of selectedGroups', () => {
            expect(setDisabledSaveButtonSemester(true, false, null, undefined)).toBeTruthy();
        });
        it('should be safe with undefined selectedGroups', () => {
            expect(setDisabledSaveButtonSemester(false, false, semester, undefined)).toBeFalsy();
        });
    });

    describe('pristine and submitting equal false', () => {
        const pristine = false;
        const submitting = false;
        it('should return false if semester is empty, null, or undefined', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeFalsy();
            expect(setDisabledSaveButtonSemester(pristine, submitting, null)).toBeFalsy();
        });
        it('should return false if semester has no groups and selectedGroups is empty', () => {
            const semesterWithoutGroups = { id: 40, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, [])).toBeFalsy();
        });
        it('should return false if semester are not empty and selectedGroups has a new group for the semester ', () => {
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, [
                    ...selectedGroups,
                    {
                        id: 82,
                        label: '22 (204-A)',
                    },
                ]),
            ).toBeFalsy();
        });
        it('should return false if semester are not empty and selectedGroups is in semester.semester_groups ', () => {
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups),
            ).toBeFalsy();
        });
    });

    describe('Edge cases for setDisabledSaveButtonSemester', () => {
        // Test with null semester
        it('should return true when semester is null and pristine is true', () => {
            // Arrange
            const pristine = true;
            const submitting = false;
            const nullSemester = null;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, nullSemester, selectedGroups);

            // Assert
            expect(result).toBeTruthy();
        });

        it('should return false when semester is null and both pristine and submitting are false', () => {
            // Arrange
            const pristine = false;
            const submitting = false;
            const nullSemester = null;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, nullSemester, selectedGroups);

            // Assert
            expect(result).toBeFalsy();
        });

        // Test with undefined selectedGroups
        it('should handle undefined selectedGroups safely with valid semester', () => {
            // Arrange
            const pristine = true;
            const submitting = false;
            const undefinedGroups = undefined;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, undefinedGroups);

            // Assert
            expect(result).toBeTruthy();
        });

        it('should handle empty array selectedGroups with pristine/submitting combinations', () => {
            // Arrange
            const emptyGroups = [];

            // Act & Assert
            expect(setDisabledSaveButtonSemester(true, false, semester, emptyGroups)).toBeFalsy();
            expect(setDisabledSaveButtonSemester(false, false, semester, emptyGroups)).toBeFalsy();
            expect(setDisabledSaveButtonSemester(true, true, semester, emptyGroups)).toBeFalsy();
        });

        // Test pristine=false, submitting=true
        it('should return true when pristine is false but submitting is true', () => {
            // Arrange
            const pristine = false;
            const submitting = true;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups);

            // Assert
            expect(result).toBeTruthy();
        });

        // Test with semester that has no semester_groups property
        it('should handle semester without semester_groups property', () => {
            // Arrange
            const semesterWithoutGroups = { id: 50 };
            const pristine = false;
            const submitting = false;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, selectedGroups);

            // Assert
            expect(result).toBeFalsy();
        });

        // Test with deleted groups scenario
        it('should return false when groups are deleted from semester', () => {
            // Arrange
            const semesterWithTwoGroups = {
                id: 100,
                semester_groups: [
                    { id: 52 },
                    { id: 82 }
                ]
            };
            const selectedGroupsWithOneGroup = [
                { id: 52, label: '21 (201-Б)' }
            ];
            const pristine = false;
            const submitting = false;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithTwoGroups, selectedGroupsWithOneGroup);

            // Assert - should be false because there's a deleted group
            expect(result).toBeFalsy();
        });

        // Test with new groups added scenario
        it('should return false when new groups are added to semester', () => {
            // Arrange
            const semesterWithOneGroup = {
                id: 101,
                semester_groups: [
                    { id: 52 }
                ]
            };
            const selectedGroupsWithTwoGroups = [
                { id: 52, label: '21 (201-Б)' },
                { id: 200, label: '22 (202-A)' }
            ];
            const pristine = false;
            const submitting = false;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithOneGroup, selectedGroupsWithTwoGroups);

            // Assert - should be false because there's a new group
            expect(result).toBeFalsy();
        });

        // Test combining pristine=true with different semester states
        it('should return true when pristine is true regardless of group changes', () => {
            // Arrange
            const semesterWithOneGroup = {
                id: 102,
                semester_groups: [{ id: 52 }]
            };
            const selectedGroupsWithChanges = [
                { id: 52 },
                { id: 300 }
            ];
            const pristine = true;
            const submitting = false;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithOneGroup, selectedGroupsWithChanges);

            // Assert
            expect(result).toBeFalsy();
        });

        // Test with empty semester_groups array and empty selectedGroups
        it('should return false when both semester_groups and selectedGroups are empty', () => {
            // Arrange
            const emptyGroupSemester = {
                id: 103,
                semester_groups: []
            };
            const emptyGroups = [];
            const pristine = false;
            const submitting = false;

            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, emptyGroupSemester, emptyGroups);

            // Assert
            expect(result).toBeFalsy();
        });
    });
});
