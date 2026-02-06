// Configuration
const API_URL = 'https://test-de-personnalit-backend.onrender.com'; // À changer après déploiement
let currentQuestion = 0;
let responses = {};
let radarChart = null;

// Éléments DOM
const welcomeScreen = document.getElementById('welcomeScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');
const progressBar = document.getElementById('progressBar');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const questionText = document.getElementById('questionText');
const blocIndicator = document.getElementById('blocIndicator');
const scaleButtons = document.querySelectorAll('.scale-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const startTestBtn = document.getElementById('startTest');
const downloadPdfBtn = document.getElementById('downloadPdf');
const restartTestBtn = document.getElementById('restartTest');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    totalQuestionsEl.textContent = NYOTA_QUESTIONS.length;
    
    // Initialiser les réponses
    NYOTA_QUESTIONS.forEach(q => {
        responses[q.id] = null;
    });
    
    // Événements
    startTestBtn.addEventListener('click', startTest);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    restartTestBtn.addEventListener('click', restartTest);
    
    // Boutons d'échelle
    scaleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectResponse(parseInt(btn.dataset.value));
        });
    });
});

// Fonctions
function startTest() {
    welcomeScreen.classList.remove('active');
    testScreen.classList.add('active');
    showQuestion(0);
}

function showQuestion(index) {
    currentQuestion = index;
    const question = NYOTA_QUESTIONS[currentQuestion];
    
    // Mettre à jour l'interface
    questionText.textContent = `${question.id}. ${question.text}`;
    blocIndicator.textContent = question.bloc;
    currentQuestionEl.textContent = question.id;
    
    // Mettre à jour la barre de progression
    const progress = ((question.id) / NYOTA_QUESTIONS.length) * 100;
    progressBar.style.setProperty('--width', `${progress}%`);
    progressBar.querySelector('::after').style.width = `${progress}%`;
    
    // Mettre à jour les boutons de navigation
    prevBtn.disabled = currentQuestion === 0;
    if (currentQuestion === NYOTA_QUESTIONS.length - 1) {
        nextBtn.textContent = 'Voir les résultats';
    } else {
        nextBtn.textContent = 'Suivant';
    }
    
    // Sélectionner la réponse précédente si elle existe
    const currentResponse = responses[question.id];
    scaleButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.value) === currentResponse) {
            btn.classList.add('selected');
        }
    });
}

function selectResponse(value) {
    const questionId = NYOTA_QUESTIONS[currentQuestion].id;
    responses[questionId] = value;
    
    scaleButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.value) === value) {
            btn.classList.add('selected');
        }
    });
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

async function showNextQuestion() {
    const questionId = NYOTA_QUESTIONS[currentQuestion].id;
    
    // Vérifier qu'une réponse a été donnée
    if (responses[questionId] === null) {
        alert('Veuillez sélectionner une réponse avant de continuer.');
        return;
    }
    
    // Si dernière question, calculer les résultats
    if (currentQuestion === NYOTA_QUESTIONS.length - 1) {
        await calculateResults();
        return;
    }
    
    showQuestion(currentQuestion + 1);
}

async function calculateResults() {
    try {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<span class="loading"></span> Calcul...';
        
        // Envoyer les réponses à l'API
        const response = await fetch(`${API_URL}/api/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responses)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Afficher les résultats
            testScreen.classList.remove('active');
            resultsScreen.classList.add('active');
            
            // Afficher le diagramme radar
            displayRadarChart(data.chart_data);
            
            // Afficher les scores détaillés
            displayScores(data.scores);
        } else {
            alert('Erreur lors du calcul : ' + data.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    } finally {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Suivant';
    }
}

function displayRadarChart(chartData) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    if (radarChart) {
        radarChart.destroy();
    }
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        backdropColor: 'transparent'
                    },
                    pointLabels: {
                        font: {
                            size: 11,
                            family: 'Segoe UI'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}/100`;
                        }
                    }
                }
            }
        }
    });
}

function displayScores(scores) {
    const scoresGrid = document.getElementById('scoresGrid');
    scoresGrid.innerHTML = '';
    
    Object.entries(scores).forEach(([axis, score]) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        
        const percentage = Math.round(score);
        const barWidth = Math.min(percentage, 100);
        
        scoreItem.innerHTML = `
            <div class="score-header">
                <span class="score-label">${axis}</span>
                <span class="score-value">${percentage}/100</span>
            </div>
            <div class="score-bar">
                <div class="score-bar-fill" style="width: ${barWidth}%"></div>
            </div>
        `;
        
        scoresGrid.appendChild(scoreItem);
    });
}

async function downloadPDF() {
    try {
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.innerHTML = '<span class="loading"></span> Génération...';
        
        // Récupérer les scores (tu pourrais les stocker après le calcul)
        const scores = radarChart.data.datasets[0].data.reduce((acc, score, index) => {
            acc[radarChart.data.labels[index]] = score;
            return acc;
        }, {});
        
        const response = await fetch(`${API_URL}/api/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scores })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Créer un lien de téléchargement
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${data.image}`;
            link.download = 'nyota-profil.png';
            link.click();
        } else {
            alert('Erreur lors de la génération : ' + data.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    } finally {
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = '📥 Télécharger le PDF';
    }
}

function restartTest() {
    // Réinitialiser les réponses
    NYOTA_QUESTIONS.forEach(q => {
        responses[q.id] = null;
    });
    
    // Revenir à l'écran d'accueil
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    
    // Réinitialiser le graphique
    if (radarChart) {
        radarChart.destroy();
        radarChart = null;
    }
}

// Gestion du clavier
document.addEventListener('keydown', (e) => {
    if (testScreen.classList.contains('active')) {
        switch(e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                selectResponse(parseInt(e.key));
                break;
            case 'ArrowLeft':
                showPreviousQuestion();
                break;
            case 'ArrowRight':
            case 'Enter':
                showNextQuestion();
                break;
        }
    }
});