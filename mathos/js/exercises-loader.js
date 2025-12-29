// ============================================
// CHARGEMENT DYNAMIQUE DES EXERCICES
// ============================================

window.loadAllExercises = async function() {
    const exercises = [];
    
    // Charger depuis Firebase si disponible
    if (window.ExerciseService) {
        try {
            const firebaseExercises = await window.ExerciseService.getAllExercises();
            exercises.push(...firebaseExercises.map(e => ({ ...e, source: 'firebase' })));
        } catch (error) {
            console.error('Erreur lors du chargement des exercices Firebase:', error);
        }
    }
    
    // Ajouter les exercices statiques
    if (window.getAllStaticExercises) {
        const staticExercises = window.getAllStaticExercises();
        exercises.push(...staticExercises.map(e => ({ ...e, source: 'static' })));
    }
    
    return exercises;
};

window.renderExercisesByClass = function(exercises, classe) {
    const filteredExercises = exercises.filter(e => e.classe === classe || e.level === classe);
    
    if (filteredExercises.length === 0) {
        return '<p class="text-muted text-center py-5">Aucun exercice disponible pour cette classe.</p>';
    }
    
    return filteredExercises.map(exercise => {
        const difficultyColors = {
            'Facile': 'success',
            'Moyen': 'warning',
            'Difficile': 'danger'
        };
        const badgeColor = difficultyColors[exercise.difficulty] || 'secondary';
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-lg h-100 exercise-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge bg-${badgeColor}">${exercise.difficulty || 'Moyen'}</span>
                            <span class="text-muted small">${exercise.time || '-'}</span>
                        </div>
                        <h5 class="card-title fw-bold">${exercise.title}</h5>
                        <p class="card-text text-muted small">${exercise.description || ''}</p>
                        <div class="d-flex align-items-center gap-2 text-muted small mb-3">
                            <i class="fas fa-tasks"></i>
                            <span>${exercise.exercises || 10} exercices</span>
                            ${exercise.hasCorrection ? '<span><i class="fas fa-check-circle text-success"></i> Corrigé</span>' : ''}
                        </div>
                        <a href="exercices-detail.html?id=${exercise.id}" class="btn btn-success w-100">
                            Commencer
                            <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

