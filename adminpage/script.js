
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.left-panel');
    mobileMenu.classList.toggle('show-mobile-menu');

   
    document.body.style.overflow = mobileMenu.classList.contains('show-mobile-menu') 
        ? 'hidden' 
        : 'auto';
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.left-panel');
    mobileMenu.classList.remove('show-mobile-menu');
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', (event) => {
    const mobileMenu = document.querySelector('.left-panel');
    const hamburgerIcon = document.querySelector('.hamburger-menu');
    
    if (
        mobileMenu.classList.contains('show-mobile-menu') && 
        !mobileMenu.contains(event.target) && 
        !hamburgerIcon.contains(event.target)
    ) {
        closeMobileMenu();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
    
    // Fetch students data para backend
    fetch('/api/students')
        .then(response => response.json())
        .then(students => {
            const rowsHTML = students.map(student => `
                <tr>
                    <td data-label="Student ID">${student.id}</td>
                    <td data-label="Name">${student.name}</td>
                    <td data-label="Email">${student.email}</td>
                    <td data-label="Actions">
                        <button class="view-btn">View</button>
                        <button class="edit-btn">Edit</button>
                    </td>
                </tr>
            `).join('');
            tbody.innerHTML = rowsHTML;
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">Error loading student data</td>
                </tr>
            `;
        });
});


document.getElementById('search-input')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});