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


(function () {
    const buttons = document.querySelectorAll('[data-action="google-calendar"]');

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
})()