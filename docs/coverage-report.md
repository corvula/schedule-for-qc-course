# Coverage Report

## Загальне покриття
- Statements/Instructions: 91.79%
- Branches: 70.94%
- Functions/Methods: 58.57%
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

<img width="887" height="644" alt="Знімок екрана 2026-05-10 о 11 09 30 пп" src="https://github.com/user-attachments/assets/9f539d71-55a1-44ca-8699-90d65568ea6a" />

<img width="1325" height="547" alt="Знімок екрана 2026-05-11 о 11 17 57 дп" src="https://github.com/user-attachments/assets/935d28db-e2e4-4903-ab5a-fa17d922aae6" />

