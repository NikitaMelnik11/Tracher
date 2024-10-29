document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const menu = document.getElementById('menu');
    const habitList = document.getElementById('habit-list');
    const totalHabits = document.getElementById('total-habits');
    const completedHabits = document.getElementById('completed-habits');
    const completionRate = document.getElementById('completion-rate');
    const progressBar = document.getElementById('progress-bar');
    const viewAll = document.getElementById('view-all');
    const viewActive = document.getElementById('view-active');
    const viewCompleted = document.getElementById('view-completed');
    const clearAll = document.getElementById('clear-all');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let currentFilter = 'all';

    function toggleMenu() {
        menu.classList.toggle('open');
    }

    function addNewHabit() {
        const habitText = prompt("Enter a new habit:");
        if (habitText && habitText.trim()) {
            habits.push({ text: habitText.trim(), completed: false });
            saveHabits();
            renderHabits(currentFilter);
            updateStats();
        }
    }

    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function updateStats() {
        totalHabits.textContent = habits.length;
        const completed = habits.filter(habit => habit.completed).length;
        completedHabits.textContent = completed;
        const rate = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
        completionRate.textContent = `${rate}%`;
        progressBar.style.width = `${rate}%`;
    }

    function renderHabits(filter = 'all') {
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
            if (
                (filter === 'all') ||
                (filter === 'active' && !habit.completed) ||
                (filter === 'completed' && habit.completed)
            ) {
                const li = document.createElement('li');
                li.className = `habit-item ${habit.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <span class="habit-text">${habit.text}</span>
                    <div class="habit-actions">
                        <button class="complete-btn" aria-label="${habit.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                            <i class="fas ${habit.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                        <button class="delete-btn" aria-label="Delete habit">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;

                const completeBtn = li.querySelector('.complete-btn');
                completeBtn.addEventListener('click', () => {
                    habits[index].completed = !habits[index].completed;
                    saveHabits();
                    renderHabits(currentFilter);
                    updateStats();
                });

                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    habits.splice(index, 1);
                    saveHabits();
                    renderHabits(currentFilter);
                    updateStats();
                });

                habitList.appendChild(li);
            }
        });
    }

    function  setActiveFilter(filter) {
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        currentFilter = filter;
        renderHabits(filter);
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    addHabitBtn.addEventListener('click', addNewHabit);

    viewAll.addEventListener('click', () => {
        setActiveFilter('all');
        toggleMenu();
    });
    viewActive.addEventListener('click', () => {
        setActiveFilter('active');
        toggleMenu();
    });
    viewCompleted.addEventListener('click', () => {
        setActiveFilter('completed');
        toggleMenu();
    });
    clearAll.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all habits?')) {
            habits = [];
            saveHabits();
            renderHabits(currentFilter);
            updateStats();
            toggleMenu();
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(btn.dataset.filter);
        });
    });

    renderHabits();
    updateStats();
});