# Coverage Report

## Загальне покриття
- Statements/Instructions: 100%
- Branches: 91.79%
- Functions/Methods: 90.69%
- Lines: 91.89%

## Аналіз

### Які функції/класи покриті найкраще?

`handleFormSubmit.js` — 100% по всіх метриках. 
`disableComponent.js` — 100% Statements, Functions, Lines, Branches 95.65%.
`cardObjectHandler.js` — 100% Statements, Functions, Lines, Branches 88.88%.

### Які потребують додаткових тестів?

`prepareTeacherCell.js` — покрито лише 62%, рядки 39-59 не покриті.
`schedule.js` — покрито 73%, рядки 24-28, 32-36 не покриті.

### Чому деякі branches не покриті?

`disableComponent.js` рядок 17: оператор `??` в 
`(selectedGroups ?? [])` має мертву гілку — дефолтний 
параметр `selectedGroups = []` перехоплює `undefined` 
до входу в тіло функції, тому права частина `??` 
ніколи не виконується.

`cardObjectHandler.js`: Istanbul рахує імпорти як 
branch — це артефакт інструменту, не проблема тестів.

## Скріншот
[вставити скріншот таблиці coverage]