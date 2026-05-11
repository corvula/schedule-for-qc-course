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
        // pristine=true, isNil(null)=true → умова if false → true
        const pristine = true;
        const submitting = true;
        let id = null;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
        id = undefined;
        expect(setDisableButton(pristine, submitting, id)).toBeTruthy();
    });

    it('should return false when id is 0 — isNil(0) is false', () => {
        // Arrange — 0 не є null/undefined → !isNil(0)=true → false
        const pristine = true;
        const submitting = false;
        const id = 0;
        // Act & Assert
        expect(setDisableButton(pristine, submitting, id)).toBeFalsy();
    });

    it('should return false when pristine is false regardless of id', () => {
        // Arrange — !false=true → завжди false
        const pristine = false;
        const submitting = false;
        const id = null;
        // Act & Assert
        expect(setDisableButton(pristine, submitting, id)).toBeFalsy();
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
        // Перевіряємо що === undefined, а не просто falsy
        expect(getClearOrCancelTitle(undefined, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
        expect(getClearOrCancelTitle(null, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
        expect(getClearOrCancelTitle(0, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });
});

describe('setDisabledSaveButtonSemester function', () => {

    describe('pristine or submitting equal true', () => {
        let pristine = true;
        let submitting = false;

        it('should return true if semester is empty — falls to else branch', () => {
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
        });

        it('should return true if semester id equals 0 — falsy id goes to else', () => {
            // semester.id=0 → !isEmpty але !semester.id → else → pristine || submitting
            const semesterWithZeroId = { id: 0, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(true, false, semesterWithZeroId, selectedGroups)).toBeTruthy();
        });

        it('should return true if semester has groups and selectedGroups matches — no changes, pristine=true', () => {
            // isChosenGroup=false → !false && (true||false) = true
            expect(setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups)).toBeTruthy();
            [pristine, submitting] = [submitting, pristine];
            expect(setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups)).toBeTruthy();
        });

        it('should return true if semester is null — isEmpty(null)=true → else', () => {
            expect(setDisabledSaveButtonSemester(true, false, null, undefined)).toBeTruthy();
        });
    });

    describe('pristine and submitting equal false', () => {
        const pristine = false;
        const submitting = false;

        it('should return false if semester is empty or null', () => {
            // isEmpty → else → false || false = false
            expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeFalsy();
            expect(setDisabledSaveButtonSemester(pristine, submitting, null)).toBeFalsy();
        });

        it('should return false if semester_groups is empty — isChosenGroup=true → false', () => {
            // isEmpty(semester_groups)=true → isChosenGroup=true → return false
            const semesterWithoutGroups = { id: 40, semester_groups: [] };
            expect(setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, [])).toBeFalsy();
        });

        it('should return false if a new group is added — newGroups is not empty', () => {
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, [
                    ...selectedGroups,
                    { id: 82, label: '22 (204-A)' },
                ]),
            ).toBeFalsy();
        });

        it('should return false if selectedGroups matches semester_groups exactly — no changes', () => {
            // isChosenGroup=false → !false && (false||false) = false
            expect(
                setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups),
            ).toBeFalsy();
        });
    });

    describe('Edge cases for setDisabledSaveButtonSemester', () => {

        it('should return true when semester is null and pristine is true', () => {
            // Arrange
            const pristine = true;
            const submitting = false;
            // Act — isEmpty(null)=true → else → true
            const result = setDisabledSaveButtonSemester(pristine, submitting, null, selectedGroups);
            // Assert
            expect(result).toBeTruthy();
        });

        it('should return false when semester is null and pristine and submitting are false', () => {
            // Arrange
            const pristine = false;
            const submitting = false;
            // Act — isEmpty(null) → else → false
            const result = setDisabledSaveButtonSemester(pristine, submitting, null, selectedGroups);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return false when selectedGroups is undefined — treated as [], groups deleted', () => {
            // Arrange — selectedGroups=undefined → restGroups=[] → deleteGroups=[52] → isChosenGroup=true → false
            const pristine = false;
            const submitting = false;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, undefined);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return true when submitting is true and no group changes', () => {
            // Arrange — однакові групи → isChosenGroup=false → !false && (false||true) = true
            const pristine = false;
            const submitting = true;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups);
            // Assert
            expect(result).toBeTruthy();
        });

        it('should handle semester without semester_groups property — undefined?.map → beginGroups=[]', () => {
            // Arrange — semester_groups відсутній → beginGroups=[] → isEmpty([])=true → isChosenGroup=true → false
            const semesterWithoutGroups = { id: 50 };
            const pristine = false;
            const submitting = false;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithoutGroups, selectedGroups);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return false when a group is deleted — deleteGroups not empty', () => {
            // Arrange — beginGroups=[52,82], restGroups=[52] → deleteGroups=[82] → isChosenGroup=true → false
            const semesterWithTwoGroups = {
                id: 100,
                semester_groups: [{ id: 52 }, { id: 82 }],
            };
            const pristine = false;
            const submitting = false;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithTwoGroups, [{ id: 52 }]);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return false when a new group is added — newGroups not empty', () => {
            // Arrange — beginGroups=[52], restGroups=[52,200] → newGroups=[200] → isChosenGroup=true → false
            const semesterWithOneGroup = { id: 101, semester_groups: [{ id: 52 }] };
            const pristine = false;
            const submitting = false;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterWithOneGroup, [
                { id: 52 },
                { id: 200 },
            ]);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return false when both semester_groups and selectedGroups are empty', () => {
            // Arrange — isEmpty([])=true → isChosenGroup=true → false
            const emptyGroupSemester = { id: 103, semester_groups: [] };
            const pristine = false;
            const submitting = false;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, emptyGroupSemester, []);
            // Assert
            expect(result).toBeFalsy();
        });

        it('should return true when both pristine and submitting are true and no group changes', () => {
            // Arrange — isChosenGroup=false → !false && (true||true) = true
            const pristine = true;
            const submitting = true;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semester, selectedGroups);
            // Assert
            expect(result).toBeTruthy();
        });

        it('should return true when submitting true and groups match exactly', () => {
            // Arrange — beginGroups=[52], restGroups=[52] → no changes → isChosenGroup=false → true
            const semesterOneGroup = { id: 102, semester_groups: [{ id: 52 }] };
            const sameGroups = [{ id: 52 }];
            const pristine = false;
            const submitting = true;
            // Act
            const result = setDisabledSaveButtonSemester(pristine, submitting, semesterOneGroup, sameGroups);
            // Assert
            expect(result).toBeTruthy();
        });
    });
});

describe('setDisableButton — killing surviving mutants', () => {

    it('should return false when ONLY pristine is false (kills || → && mutant)', () => {
        const pristine = false;
        const id = null; // isNil(null)=true, тому !isNil=false
        expect(setDisableButton(pristine, false, id)).toBeFalsy();
    });

    it('should return false when ONLY id is not nil (kills || → && mutant)', () => {e
        const pristine = true;
        const id = 5; 
        expect(setDisableButton(pristine, false, id)).toBeFalsy();
    });

    it('should return true ONLY when both pristine=true AND id is nil', () => {
        expect(setDisableButton(true, false, null)).toBeTruthy();
        expect(setDisableButton(true, false, undefined)).toBeTruthy();
        expect(setDisableButton(false, false, null)).toBeFalsy();
        expect(setDisableButton(true, false, 0)).toBeFalsy();
    });
});

describe('getClearOrCancelTitle — killing surviving mutants', () => {

    it('should distinguish === undefined from !== undefined (kills negation mutant)', () => {
        // Мутант: id !== undefined → поміняє результати місцями
        // Arrange & Assert — undefined дає CLEAR
        expect(getClearOrCancelTitle(undefined, i18n.t)).toEqual(CLEAR_BUTTON_LABEL);
        // будь-що інше дає CANCEL
        expect(getClearOrCancelTitle(null, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
        expect(getClearOrCancelTitle(1, i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
        expect(getClearOrCancelTitle('', i18n.t)).toEqual(CANCEL_BUTTON_TITLE);
    });
});

describe('setDisabledSaveButtonSemester — killing surviving mutants', () => {

    it('kills && → || mutant on isEmpty(semester) && semester.id check', () => {
        const pristine = true;
        const submitting = false;
        expect(setDisabledSaveButtonSemester(pristine, submitting, {})).toBeTruthy();
        expect(setDisabledSaveButtonSemester(false, false, {})).toBeFalsy();
    });

    it('kills semester.id removal mutant — semester with id vs without', () => {
        const semesterZeroId = { id: 0, semester_groups: [{ id: 52 }] };
        expect(setDisabledSaveButtonSemester(true, false, semesterZeroId, selectedGroups)).toBeTruthy();
        expect(setDisabledSaveButtonSemester(false, false, semesterZeroId, selectedGroups)).toBeFalsy();
    });

    it('kills pristine || submitting → pristine && submitting mutant in else branch', () => {
        // Мутант: return pristine && submitting (замість ||)
        // З pristine=true, submitting=false → && дає false, || дає true
        expect(setDisabledSaveButtonSemester(true, false, null)).toBeTruthy();
        // З pristine=false, submitting=true → && дає false, || дає true
        expect(setDisabledSaveButtonSemester(false, true, null)).toBeTruthy();
        expect(setDisabledSaveButtonSemester(false, false, null)).toBeFalsy();
    });

    it('kills pristine || submitting → pristine && submitting mutant in if branch', () => {
        // Те саме але для гілки if (semester є і має id, немає змін у групах)
        const sameSemester = { id: 47, semester_groups: [{ id: 52 }] };
        const sameGroups = [{ id: 52 }]; // немає змін → isChosenGroup=false
        // pristine=true, submitting=false → || дає true, && дає false
        expect(setDisabledSaveButtonSemester(true, false, sameSemester, sameGroups)).toBeTruthy();
        // pristine=false, submitting=true → || дає true, && дає false
        expect(setDisabledSaveButtonSemester(false, true, sameSemester, sameGroups)).toBeTruthy();
        // обидва false → обидва дають false
        expect(setDisabledSaveButtonSemester(false, false, sameSemester, sameGroups)).toBeFalsy();
    });

    it('kills !isChosenGroup → isChosenGroup mutant', () => {
        // Мутант: isChosenGroup && (pristine||submitting) замість !isChosenGroup
        // Коли isChosenGroup=false (немає змін) і pristine=true:
        //   правильно: !false && true = true
        //   мутант: false && true = false
        const sameSemester = { id: 47, semester_groups: [{ id: 52 }] };
        const sameGroups = [{ id: 52 }];
        expect(setDisabledSaveButtonSemester(true, false, sameSemester, sameGroups)).toBeTruthy();
    });

    it('kills isEmpty(semester.semester_groups) removal mutant in isChosenGroup', () => {
        // Мутант: прибирає isEmpty(semester.semester_groups) з isChosenGroup
        // З порожнім semester_groups і однаковими groups → без isEmpty було б false, з ним true
        const emptyGroupsSemester = { id: 10, semester_groups: [] };
        // isEmpty([])=true → isChosenGroup=true → return false (кнопка активна)
        expect(setDisabledSaveButtonSemester(true, false, emptyGroupsSemester, [])).toBeFalsy();
        expect(setDisabledSaveButtonSemester(false, true, emptyGroupsSemester, [])).toBeFalsy();
    });

    it('kills !isEmpty(newGroups) → isEmpty(newGroups) mutant', () => {
        // Мутант: isEmpty(newGroups) — перевертає логіку для нових груп
        // Коли є нова група → newGroups=[200] → !isEmpty=true → isChosenGroup=true → false
        // З мутантом: isEmpty=false → isChosenGroup залежить тільки від інших умов
        const oneSemester = { id: 10, semester_groups: [{ id: 52 }] };
        const withNewGroup = [{ id: 52 }, { id: 200 }];
        expect(setDisabledSaveButtonSemester(false, false, oneSemester, withNewGroup)).toBeFalsy();
        expect(setDisabledSaveButtonSemester(true, false, oneSemester, withNewGroup)).toBeFalsy();
    });

    it('kills !isEmpty(deleteGroups) → isEmpty(deleteGroups) mutant', () => {
        // Мутант: isEmpty(deleteGroups) — перевертає логіку для видалених груп
        const twoGroupsSemester = { id: 10, semester_groups: [{ id: 52 }, { id: 82 }] };
        const withDeletedGroup = [{ id: 52 }]; // видалено групу 82
        // deleteGroups=[82] → !isEmpty=true → isChosenGroup=true → false
        expect(setDisabledSaveButtonSemester(false, false, twoGroupsSemester, withDeletedGroup)).toBeFalsy();
        expect(setDisabledSaveButtonSemester(true, false, twoGroupsSemester, withDeletedGroup)).toBeFalsy();
    });

    it('kills || → && mutant in isChosenGroup calculation', () => {
        // isChosenGroup = A || B || C
        // Мутант може замінити || на && між будь-якими двома умовами
        // Тест: тільки одна умова true має давати isChosenGroup=true

        // Тільки isEmpty(semester_groups)=true, newGroups=[], deleteGroups=[]
        const emptySemester = { id: 1, semester_groups: [] };
        expect(setDisabledSaveButtonSemester(false, false, emptySemester, [])).toBeFalsy();

        // Тільки newGroups не порожній
        const oneSemester = { id: 1, semester_groups: [{ id: 52 }] };
        expect(setDisabledSaveButtonSemester(false, false, oneSemester, [{ id: 52 }, { id: 99 }])).toBeFalsy();

        // Тільки deleteGroups не порожній
        expect(setDisabledSaveButtonSemester(false, false, oneSemester, [])).toBeFalsy();
    });
});