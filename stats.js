




// Update User interface (cards, Tables)
// ============================================
function updateUI(data) {
    // Update Cards
    document.getElementById('totalHours').textContent = data.totalStudyHours || 0;
    document.getElementById('completedSessions').textContent = data.completedSessions || 0;
    document.getElementById('totalSessionsCount').textContent = data.totalSessions || 0;
    document.getElementById('missedSessions').textContent = data.missedSessions || 0;
    document.getElementById('completionRate').textContent = (data.completionRate || 0) + '%';
    document.getElementById('completionFill').style.width = (data.completionRate || 0) + '%';
    
    // Update Course table
    const courseTable = document.getElementById('courseTable');
    if (courseTable) {
        courseTable.innerHTML = '';
        
        if (data.courseProgress && data.courseProgress.length > 0) {
            data.courseProgress.forEach(course => {
                courseTable.innerHTML += `
                    <tr>
                        <td><strong>${course.course}</strong></td>
                        <td>${course.hours || 0}</td>
                        <td>
                            <div class="mini-progress">
                                <div class="mini-fill" style="width: ${course.completionRate || 0}%"></div>
                                <span>${course.completionRate || 0}%</span>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            courseTable.innerHTML = '<tr><td colspan="3">No course data available</td></tr>';
        }
    }
}


// Showing Sessions list
// ============================================
function renderSessions(sessions) {
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;
    
    sessionsList.innerHTML = '';
    
    if (!sessions || sessions.length === 0) {
        sessionsList.innerHTML = '<div class="session-item">No study sessions available</div>';
        return;
    }
    
    sessions.forEach(session => {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = `session-item ${session.status === 'completed' ? 'completed' : session.status === 'missed' ? 'missed' : ''}`;
        
        // جلب اسم المادة (من populate أو مباشر)
        const courseName = session.courseId?.courseName || session.courseName || 'Unknown Course';
        
        sessionDiv.innerHTML = `
            <div class="session-info">
                <div class="session-course">${courseName}</div>
                <div class="session-details">
                    📅 ${session.date ? session.date.split('T')[0] : 'No date'} | 
                    ⏰ ${session.startTime || '--'} - ${session.endTime || '--'}
                </div>
            </div>
            <div class="session-actions">
                ${session.status === 'pending' ? `
                    <button class="btn-success" onclick="markSession('${session._id}', 'completed')">✓ Complete</button>
                    <button class="btn-fail" onclick="markSession('${session._id}', 'missed')">✗ Missed</button>
                ` : `
                    <span class="session-status ${session.status}">
                        ${session.status === 'completed' ? '✓ Completed' : session.status === 'missed' ? '✗ Missed' : '⏳ Pending'}
                    </span>
                `}
            </div>
        `;
        
        sessionsList.appendChild(sessionDiv);
    });
}

// Updating Charts
// ============================================
function updateCharts(data) {
    // Update Weekly chart(Bar Chart)
    const weeklyCtx = document.getElementById('weeklyChart')?.getContext('2d');
    if (weeklyCtx) {
        // 
        if (window.weeklyChart) window.weeklyChart.destroy();
        
        const weeklyHours = data.weeklyHours || [];
        const hoursData = weeklyHours.map(w => w.hours || 0);
        
        window.weeklyChart = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: hoursData.length === 7 ? hoursData : [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#ec6f09',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    //  Update(Doughnut Chart)
    const distCtx = document.getElementById('distributionChart')?.getContext('2d');
    if (distCtx) {
        if (window.distributionChart) window.distributionChart.destroy();
        
        const courseDistribution = data.courseDistribution || [];
        const labels = courseDistribution.map(c => c.course || 'Unknown');
        const values = courseDistribution.map(c => c.hours || 0);
        
        const defaultColors = ['#ec6f09', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec489a'];
        
        window.distributionChart = new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['No Data'],
                datasets: [{
                    data: values.length > 0 ? values : [1],
                    backgroundColor: labels.length > 0 ? defaultColors.slice(0, labels.length) : ['#555']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }
}

// ============================================
// Fetch Data From API
// ============================================
async function fetchStatistics() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.warn('No token found, user might not be logged in');
            // display message to user
            const sessionsList = document.getElementById('sessionsList');
            if (sessionsList) {
                sessionsList.innerHTML = '<div class="session-item">Please login to view your study sessions</div>';
            }
            return;
        }
        
        const response = await fetch('/api/statistics', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            // Update the whole page 
            updateUI(data);
            updateCharts(data);
            renderSessions(data.sessions || []);
        } else {
            console.error('API returned error:', result.message);
        }
        
    } catch (error) {
        console.error('Error fetching statistics:', error);
        
        // display message to user
        const sessionsList = document.getElementById('sessionsList');
        if (sessionsList) {
            sessionsList.innerHTML = '<div class="session-item">Error loading data. Please try again later.</div>';
        }
    }
}

// ============================================
// Update state of session (Complete / Missed)
// ============================================
async function markSession(sessionId, status) {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Please login first');
            return;
        }
        
        const response = await fetch(`/api/statistics/sessions/${sessionId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Reload data after updating
            await fetchStatistics();
            showNotification(`Session marked as ${status}! 🎉`);
        } else {
            console.error('Error updating session:', result.message);
            showNotification('Failed to update session', 'error');
        }
        
    } catch (error) {
        console.error('Error marking session:', error);
        showNotification('An error occurred', 'error');
    }
}

// ============================================
// إظهار إشعار للمستخدم
// ============================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// load content when opening page
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    fetchStatistics();
});