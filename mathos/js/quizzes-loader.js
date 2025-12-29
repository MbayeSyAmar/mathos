// ============================================
// CHARGEMENT DYNAMIQUE DES QUIZ
// ============================================

window.loadAllQuizzes = async function() {
    const quizzes = [];
    
    // Charger depuis Firebase si disponible
    if (window.QuizService) {
        try {
            const firebaseQuizzes = await window.QuizService.getAllQuizzes();
            quizzes.push(...firebaseQuizzes.map(q => ({ ...q, source: 'firebase' })));
        } catch (error) {
            console.error('Erreur lors du chargement des quiz Firebase:', error);
        }
    }
    
    // Ajouter les quiz statiques
    if (window.getAllStaticQuizzes) {
        const staticQuizzes = window.getAllStaticQuizzes();
        quizzes.push(...staticQuizzes.map(q => ({ ...q, source: 'static' })));
    }
    
    return quizzes;
};

window.renderQuizzesByClass = function(quizzes, classe) {
    const filteredQuizzes = quizzes.filter(q => {
        const level = q.level || '';
        return level.toLowerCase().includes(classe.toLowerCase()) || 
               (classe === 'Collège' && level === 'Collège') ||
               (classe === 'Lycée' && level === 'Lycée');
    });
    
    if (filteredQuizzes.length === 0) {
        return '<p class="text-muted text-center py-5">Aucun quiz disponible pour ce niveau.</p>';
    }
    
    return filteredQuizzes.map(quiz => {
        const difficultyColors = {
            'Facile': 'success',
            'Moyen': 'warning',
            'Difficile': 'danger',
            'Très difficile': 'dark'
        };
        const badgeColor = difficultyColors[quiz.difficulty] || 'secondary';
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-lg h-100 quiz-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge bg-${badgeColor}">${quiz.difficulty || 'Moyen'}</span>
                            <span class="text-muted small">${quiz.time || '-'}</span>
                        </div>
                        <h5 class="card-title fw-bold">${quiz.title}</h5>
                        <p class="card-text text-muted small">${quiz.description || ''}</p>
                        <div class="d-flex align-items-center gap-2 text-muted small mb-3">
                            <i class="fas fa-question-circle"></i>
                            <span>${quiz.questions || 10} questions</span>
                            ${quiz.popularity ? `<span><i class="fas fa-star text-warning"></i> ${quiz.popularity}</span>` : ''}
                        </div>
                        <a href="quiz-detail.html?id=${quiz.id}" class="btn btn-warning text-white w-100">
                            Commencer le quiz
                            <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

