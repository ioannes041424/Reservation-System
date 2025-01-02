document.addEventListener('DOMContentLoaded', () => {
    const studentsGrid = document.querySelector('.students-grid');
    
    // Fetch students from the backend
    fetch('http://localhost:3001/api/students')
        .then(response => response.json())
        .then(students => {
            const cardsHTML = students.map(student => `
                <div class="student-card">
                    <div class="student-avatar">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="student-info">
                        <h3>${student.name}</h3>
                        <p>${student.email}</p>
                    </div>
                    <div class="student-actions">
                        <button class="view-btn">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            studentsGrid.innerHTML = cardsHTML;
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            studentsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading student data</p>
                </div>
            `;
        });
});

document.getElementById('search-input')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.student-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});