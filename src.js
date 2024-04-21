function addToGoogleCalendar(eventTitle, eventDate, eventTime) {
    const eventDateTime = new Date(`${eventDate}T${eventTime}:00Z`);
    const formattedDate = eventDateTime.toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${encodeURIComponent(formattedDate)}/${encodeURIComponent(formattedDate)}`;
    window.open(googleCalendarUrl, '_blank');
}

function parseUtcDate(dateStr) {
    const dateParts = dateStr.split(' ');
    const [day, month, year] = dateParts[0].split('.');
    const [hours, minutes] = dateParts[1].split(':');
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    return utcDate;
}

function replaceUtcDatesToLocalTime() {
    const utcDateSpans = document.querySelectorAll('span[data-date-utc]');

    utcDateSpans.forEach(span => {
        const utcDateStr = span.textContent.trim();
        const localDateStr = parseUtcDate(utcDateStr).toLocaleString();

        span.textContent = localDateStr;
        span.removeAttribute('data-date-utc');
        span.setAttribute('data-date-local', localDateStr);
    });
}

function updateProgressBar() {
    const progressBars = document.querySelectorAll('div[data-progress]');

    progressBars.forEach(p => {
        const startTime = p.getAttribute('data-start-time');
        const endTime = p.getAttribute('data-end-time');
    
        const currentTime = Date.now(); 
        const startTimeMs = new Date(startTime).getTime(); 
        const endTimeMs = new Date(endTime).getTime();
    
        const totalDuration = endTimeMs - startTimeMs;
        const elapsedTime = currentTime - startTimeMs;
    
        const progressPercentage = (elapsedTime / totalDuration) * 100;
    
        const progressIndicator = p.firstElementChild;
        progressIndicator.style.width = `${progressPercentage}%`;
    })
}


function startCountdown(e) {
    const eventDate = e.getAttribute('data-date');
    const eventTime = e.getAttribute('data-time');
    const eventDateTime = new Date(`${eventDate}T${eventTime}:00Z`);

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const targetDate = new Date(eventDateTime).getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            e.textContent = 'Live!';
            return;
        }

        const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor(distance % (1000 * 60 * 60 * 24 * 7) / (1000 * 60 * 60 * 24));
        const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds =  String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

        e.textContent = `${weeks}W ${days}D ${hours}H ${minutes}M ${seconds}S`; 
    }, 1000);
} 


(function () {
    const buttons = document.querySelectorAll('[data-action="google-calendar"]');
    const countdowns = document.querySelectorAll('[data-countdown]');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const eventTitle = button.getAttribute('data-title');
            const eventDate = button.getAttribute('data-date');
            const eventTime = button.getAttribute('data-time');

            addToGoogleCalendar(eventTitle, eventDate, eventTime);
        });
    });

    replaceUtcDatesToLocalTime();

    updateProgressBar();

    setInterval(() => {
        updateProgressBar();
    }, 1000);


    countdowns.forEach(startCountdown);

    document.addEventListener('DOMContentLoaded', function() {
        const currentYear = new Date().getFullYear();
        document.getElementById('currentYear').textContent = currentYear;
    });
})()