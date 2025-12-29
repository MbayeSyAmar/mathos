// ============================================
// CHARGEMENT DYNAMIQUE DES COURS
// ============================================

window.loadAllCourses = async function() {
    const courses = [];
    
    // Charger depuis Firebase si disponible
    if (window.CourseService) {
        try {
            const firebaseCourses = await window.CourseService.getAllCourses();
            courses.push(...firebaseCourses.map(c => ({ ...c, source: 'firebase' })));
        } catch (error) {
            console.error('Erreur lors du chargement des cours Firebase:', error);
        }
    }
    
    // Ajouter les cours statiques
    if (window.getAllStaticCourses) {
        const staticCourses = window.getAllStaticCourses();
        courses.push(...staticCourses.map(c => ({ ...c, source: 'static' })));
    }
    
    return courses;
};

window.renderCoursesByClass = function(courses, classe) {
    const filteredCourses = courses.filter(c => c.classe === classe || c.level === classe);
    
    if (filteredCourses.length === 0) {
        return '<p class="text-muted text-center py-5">Aucun cours disponible pour cette classe.</p>';
    }
    
    return filteredCourses.map(course => {
        const imageUrl = course.image || `https://images.unsplash.com/photo-${150 + course.id}?w=800&h=600&fit=crop`;
        const gradientColors = [
            'rgba(59,130,246,0.85), rgba(96,165,250,0.85)',
            'rgba(16,185,129,0.85), rgba(52,211,153,0.85)',
            'rgba(139,92,246,0.85), rgba(167,139,250,0.85)',
            'rgba(245,158,11,0.85), rgba(251,191,36,0.85)'
        ];
        const gradient = gradientColors[course.id % gradientColors.length];
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-lg h-100 course-card">
                    <div class="image-container position-relative overflow-hidden" style="height: 200px;">
                        <img src="${imageUrl}" alt="${course.title}" class="w-100 h-100" style="object-fit: cover;">
                        <div class="position-absolute top-0 start-0 w-100 h-100" style="background: linear-gradient(135deg, ${gradient});"></div>
                        <div class="particles">
                            <div class="particle" style="left: 20%; animation-delay: 0s;"></div>
                            <div class="particle" style="left: 60%; animation-delay: 2s;"></div>
                        </div>
                        <div class="position-absolute bottom-0 start-0 w-100 p-3" style="z-index: 1;">
                            <span class="badge bg-white bg-opacity-95 text-primary mb-2">${course.classe || course.level}</span>
                            <h3 class="text-white fw-bold mb-0" style="font-size: 1.375rem; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">${course.title}</h3>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-3" style="font-size: 0.9375rem;">${course.description || ''}</p>
                        <div class="d-flex align-items-center gap-2 text-muted small">
                            <i class="fas fa-clock"></i>
                            <span>${course.duration || '-'}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                        <a href="cours-detail.html?id=${course.id}" class="btn btn-primary w-100">
                            Commencer le cours
                            <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

