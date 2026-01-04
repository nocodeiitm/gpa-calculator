document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const gpaValueSpan = document.getElementById('gpa-value');
    const sgpaValueSpan = document.getElementById('sgpa-value');

    // Grade mapping based on user request (assuming 'A' was omitted in the list of 5 letters but needed for the 6 numbers)
    // User listed: S, B, C, D, E (5 letters)
    // User listed: 10, 9, 8, 7, 6, 4 (6 numbers)
    // Best fit: S=10, A=9, B=8, C=7, D=6, E=4
    const gradeOptions = [
        { label: 'S', points: 10 },
        { label: 'A', points: 9 }, // Added to match the sequence 10,9,8...
        { label: 'B', points: 8 },
        { label: 'C', points: 7 },
        { label: 'D', points: 6 },
        { label: 'E', points: 4 }
    ];

    // Initial 5 courses
    for (let i = 0; i < 5; i++) {
        addCourseRow();
    }

    addCourseBtn.addEventListener('click', () => {
        addCourseRow();
    });

    calculateBtn.addEventListener('click', calculateGPA);

    function addCourseRow() {
        const row = document.createElement('div');
        row.className = 'course-row';

        // Credits Input
        const creditsGroup = document.createElement('div');
        creditsGroup.className = 'input-group';
        creditsGroup.style.marginBottom = '0';

        const creditsLabel = document.createElement('label');
        creditsLabel.textContent = 'Credits';
        creditsGroup.appendChild(creditsLabel);

        const creditsInput = document.createElement('input');
        creditsInput.type = 'number';
        creditsInput.className = 'course-credits';
        creditsInput.placeholder = 'e.g. 3';
        creditsInput.min = '0';
        creditsGroup.appendChild(creditsInput);

        // Grade Select
        const gradeGroup = document.createElement('div');
        gradeGroup.className = 'input-group';
        gradeGroup.style.marginBottom = '0';

        const gradeLabel = document.createElement('label');
        gradeLabel.textContent = 'Expected Grade';
        gradeGroup.appendChild(gradeLabel);

        const gradeSelect = document.createElement('select');
        gradeSelect.className = 'course-grade';

        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Grade';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        gradeSelect.appendChild(defaultOption);

        gradeOptions.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade.points;
            option.textContent = `${grade.label} (${grade.points})`;
            gradeSelect.appendChild(option);
        });
        gradeGroup.appendChild(gradeSelect);

        // Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove Course';
        removeBtn.onclick = () => {
            if (courseList.children.length > 1) {
                row.remove();
            }
        };

        row.appendChild(creditsGroup);
        row.appendChild(gradeGroup);
        row.appendChild(removeBtn);

        courseList.appendChild(row);
    }

    function calculateGPA() {
        const currentGPA = parseFloat(document.getElementById('current-gpa').value);
        const completedCredits = parseFloat(document.getElementById('completed-credits').value);

        let totalPoints = 0;
        let totalCredits = 0;

        // Add current stats if valid
        if (!isNaN(currentGPA) && !isNaN(completedCredits)) {
            totalPoints += currentGPA * completedCredits;
            totalCredits += completedCredits;
        }

        const prevPoints = totalPoints;
        const prevCredits = totalCredits;

        // Add projected courses
        const courseRows = document.querySelectorAll('.course-row');
        let hasError = false;

        courseRows.forEach(row => {
            const creditsStr = row.querySelector('.course-credits').value;
            const gradePointsStr = row.querySelector('.course-grade').value;

            if (creditsStr && gradePointsStr) {
                const credits = parseFloat(creditsStr);
                const points = parseFloat(gradePointsStr);

                if (credits > 0) {
                    totalPoints += points * credits;
                    totalCredits += credits;
                }
            }
        });

        if (totalCredits === 0) {
            alert('Please enter at least one valid course or valid current stats.');
            return;
        }

        const projectedGPA = totalPoints / totalCredits;

        let sgpa = 0;
        const newCredits = totalCredits - prevCredits;
        if (newCredits > 0) {
            sgpa = (totalPoints - prevPoints) / newCredits;
        }

        gpaValueSpan.textContent = projectedGPA.toFixed(2);

        if (sgpaValueSpan) {
            sgpaValueSpan.textContent = sgpa.toFixed(2);
        }

        resultDiv.classList.remove('hidden');
    }
});
