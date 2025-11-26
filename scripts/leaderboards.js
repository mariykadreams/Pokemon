async function loadLeaderboard() {
    try {
        const response = await fetch('../scripts/users.json')
        if (!response.ok) {
            throw new Error('Failed to load leaderboard data')
        }
        
        const users = await response.json()
        
        const sortedUsers = users.sort((a, b) => (b.finding_game_score || 0) - (a.finding_game_score || 0))
        
        const tbody = document.getElementById('leaderboard-body')
        tbody.innerHTML = ''
        
        sortedUsers.forEach((user, index) => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.finding_game_score || 0}</td>
                <td>${user.quiz_score || 0}</td>
            `
            tbody.appendChild(row)
        })
    } catch (error) {
        console.error('Error loading leaderboard:', error)
        const tbody = document.getElementById('leaderboard-body')
        tbody.innerHTML = '<tr><td colspan="3">Error loading leaderboard data</td></tr>'
    }
}

document.addEventListener('DOMContentLoaded', loadLeaderboard)

