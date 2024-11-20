// Get the table element
const table = document.querySelector('table');

// Add event listener to the table
table.addEventListener('DOMContentLoaded', () => {
    // Get the registered students data from the backend
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            // Create the table rows
            const rows = data.map(student => {
                return `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });

            // Add the table rows to the table body
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = rows.join('');
        })
        .catch(error => console.error(error));
});
