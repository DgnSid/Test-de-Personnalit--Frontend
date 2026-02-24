// Configuration
const API_URL = ''; // À changer après déploiement
let currentQuestion = 0;
let responses = {};
let radarChart = null;
let detailedCharts = {};

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
const downloadAllChartsBtn = document.getElementById('downloadAllCharts');

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
    if (downloadAllChartsBtn) {
        downloadAllChartsBtn.addEventListener('click', downloadAllChartsAsImages);
    }
    
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
        alert('Veuillez choisir une réponse avant de continuer.');
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
        // 1. Afficher les écrans
        testScreen.classList.remove('active');
        resultsScreen.classList.add('active');

        // 2. Afficher le radar interactif du haut (Chart.js)
        if (data.chart_data) {
            displayRadarChart(data.chart_data);
        } else {
            console.error('chart_data manquant dans la réponse API');
            alert('Impossible d\'afficher le graphique radar (données manquantes).');
        }
        displayScores(data.scores);

        // 3. Afficher les graphiques détaillés sur la même page
        renderDetailedCharts(data.scores);

        // 4. ISOLATION DU RAPPORT PYTHON
        const reportContainer = document.getElementById('pythonReportContainer');
        reportContainer.innerHTML = `
            <div style="margin-top: 30px; text-align: center; border-top: 2px solid #eee; padding-top: 20px;">
                <h3 style="color: #0066FF; margin-bottom: 20px;">📜 Rapport d'Analyse Détaillé</h3>
                <iframe id="reportFrame" style="width: 100%; border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>
            </div>
        `;

        const iframe = document.getElementById('reportFrame');
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(data.html_report);
        doc.close();
        setTimeout(() => {
            iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 50) + 'px';
        }, 300);
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
            maintainAspectRatio: false, //True nor
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)' // Couleur des rayons
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)' // Couleur de la toile d'araignée
                    },
                    pointLabels: {
                        color: '#333', // Force la couleur des textes (Ouverture, etc.) en gris foncé
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
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
                    display: true, //n'existait pas avant
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

function renderDetailedCharts(scores) {
    destroyDetailedCharts();

    const grid = document.getElementById('detailedChartsGrid');
    if (!grid) return;

    const labels = Object.keys(scores);
    const values = Object.values(scores);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThree = sorted.slice(0, 3);
    const bottomThree = sorted.slice(-3);

    const chartConfigs = [
        {
            id: 'axesBarChart',
            title: 'Scores Par Axe',
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Score /100',
                    data: values,
                    backgroundColor: 'rgba(46, 134, 171, 0.65)',
                    borderColor: 'rgba(46, 134, 171, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        },
        {
            id: 'polarAreaChart',
            title: 'Vue Polar Des Dimensions',
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.5)',
                        'rgba(16, 185, 129, 0.5)',
                        'rgba(245, 158, 11, 0.5)',
                        'rgba(239, 68, 68, 0.5)',
                        'rgba(139, 92, 246, 0.5)',
                        'rgba(6, 182, 212, 0.5)',
                        'rgba(236, 72, 153, 0.5)',
                        'rgba(34, 197, 94, 0.5)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { r: { beginAtZero: true, max: 100 } }
            }
        },
        {
            id: 'topBottomChart',
            title: 'Top 3 Vs Bottom 3',
            type: 'bar',
            data: {
                labels: [...topThree.map(([k]) => k), ...bottomThree.map(([k]) => k)],
                datasets: [{
                    label: 'Score /100',
                    data: [...topThree.map(([, v]) => v), ...bottomThree.map(([, v]) => v)],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.65)',
                        'rgba(16, 185, 129, 0.65)',
                        'rgba(16, 185, 129, 0.65)',
                        'rgba(239, 68, 68, 0.65)',
                        'rgba(239, 68, 68, 0.65)',
                        'rgba(239, 68, 68, 0.65)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        },
        {
            id: 'balanceChart',
            title: 'Répartition Globale',
            type: 'doughnut',
            data: {
                labels: ['Forces (Top 3)', 'Axes de progrès (Bottom 3)'],
                datasets: [{
                    data: [
                        topThree.reduce((sum, [, v]) => sum + v, 0),
                        bottomThree.reduce((sum, [, v]) => sum + v, 0)
                    ],
                    backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(239, 68, 68, 0.75)'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        }
    ];

    grid.innerHTML = chartConfigs.map((config) => `
        <div class="chart-card">
            <h4>${config.title}</h4>
            <div class="chart-canvas-wrap">
                <canvas id="${config.id}"></canvas>
            </div>
            <button class="btn-secondary chart-download-btn" data-chart-id="${config.id}" data-chart-title="${config.title}">
                📥 Télécharger en PNG
            </button>
        </div>
    `).join('');

    chartConfigs.forEach((config) => {
        const ctx = document.getElementById(config.id).getContext('2d');
        detailedCharts[config.id] = new Chart(ctx, {
            type: config.type,
            data: config.data,
            options: config.options
        });
    });

    document.querySelectorAll('.chart-download-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            downloadChartImage(btn.dataset.chartId, btn.dataset.chartTitle);
        });
    });
}

function destroyDetailedCharts() {
    Object.values(detailedCharts).forEach((chart) => chart.destroy());
    detailedCharts = {};
    const grid = document.getElementById('detailedChartsGrid');
    if (grid) {
        grid.innerHTML = '';
    }
}

function downloadChartImage(chartId, title) {
    const chart = detailedCharts[chartId];
    if (!chart) return;

    const link = document.createElement('a');
    link.href = chart.toBase64Image('image/png', 1);
    link.download = `${sanitizeFileName(title)}.png`;
    link.click();
}

function downloadAllChartsAsImages() {
    if (radarChart) {
        const link = document.createElement('a');
        link.href = radarChart.toBase64Image('image/png', 1);
        link.download = 'diagramme-kiviat.png';
        link.click();
    }

    Object.entries(detailedCharts).forEach(([id, chart], index) => {
        const link = document.createElement('a');
        link.href = chart.toBase64Image('image/png', 1);
        link.download = `graphique-${index + 1}-${sanitizeFileName(id)}.png`;
        link.click();
    });
}

function sanitizeFileName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
    destroyDetailedCharts();
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
