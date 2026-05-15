const monthDisplay = document.getElementById('monthDisplay');
const calendarBody = document.getElementById('calendarBody');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const eventModal = document.getElementById('eventModal');
const modalDateDisplay = document.getElementById('modalDate');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEvent');
const deleteEventBtn = document.getElementById('deleteEvent');
const closeBtn = document.querySelector('.close-button');

let currentDate = new Date();
let selectedDateKey = '';

// LocalStorage key prefix
const STORAGE_PREFIX = 'calendar_event_';

function renderCalendar() {
    calendarBody.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthDisplay.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarBody.appendChild(emptyDiv);
    }

    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if it's today
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayDiv.classList.add('today');
        }

        // Check for events
        const eventData = localStorage.getItem(STORAGE_PREFIX + dateKey);
        if (eventData) {
            dayDiv.classList.add('has-event');
            const summary = document.createElement('div');
            summary.classList.add('event-summary');
            summary.textContent = eventData;
            dayDiv.appendChild(summary);
        }

        dayDiv.onclick = () => openModal(dateKey);
        calendarBody.appendChild(dayDiv);
    }
}

function openModal(dateKey) {
    selectedDateKey = dateKey;
    modalDateDisplay.textContent = dateKey;
    const savedEvent = localStorage.getItem(STORAGE_PREFIX + dateKey);
    eventInput.value = savedEvent || '';
    eventModal.style.display = 'block';
}

function closeModal() {
    eventModal.style.display = 'none';
}

function saveEvent() {
    const text = eventInput.value.trim();
    if (text) {
        localStorage.setItem(STORAGE_PREFIX + selectedDateKey, text);
    } else {
        localStorage.removeItem(STORAGE_PREFIX + selectedDateKey);
    }
    closeModal();
    renderCalendar();
}

function deleteEvent() {
    localStorage.removeItem(STORAGE_PREFIX + selectedDateKey);
    closeModal();
    renderCalendar();
}

prevMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

nextMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

saveEventBtn.onclick = saveEvent;
deleteEventBtn.onclick = deleteEvent;
closeBtn.onclick = closeModal;

window.onclick = (event) => {
    if (event.target == eventModal) {
        closeModal();
    }
};

// Initial Render
renderCalendar();
