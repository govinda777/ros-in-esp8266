// ESP8266 Academy - Interactive Learning Platform
class ESP8266Academy {
    constructor() {
        this.currentView = 'curriculum';
        this.currentLesson = null;
        this.editor = null;
        this.userProgress = this.loadUserProgress();
        this.curriculum = this.loadCurriculum();
        this.achievements = this.loadAchievements();
        this.deviceState = this.initializeDeviceState();
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMonacoEditor();
        this.renderCurriculum();
        this.renderAchievements();
        this.updateUserStats();
        this.setupEventListeners();
        this.updateDashboard();
    }

    // Data Loading and Management
    loadUserProgress() {
        const stored = localStorage.getItem('esp8266_progress');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            current_level: 1,
            total_xp: 0,
            completed_lessons: [],
            current_lesson: "1.1",
            streak_days: 0,
            badges_earned: [],
            learning_path: "beginner",
            last_activity: new Date().toISOString()
        };
    }

    saveUserProgress() {
        localStorage.setItem('esp8266_progress', JSON.stringify(this.userProgress));
    }

    loadCurriculum() {
        return {
            modules: [
                {
                    id: "module-1",
                    title: "ESP8266 Fundamentos",
                    description: "Aprenda os conceitos básicos do ESP8266 e MicroPython",
                    difficulty: "Iniciante",
                    estimated_hours: 8,
                    prerequisites: [],
                    lessons: [
                        {
                            id: "1.1",
                            title: "Hello World & Console Output",
                            description: "Seu primeiro programa ESP8266",
                            xp_points: 50,
                            difficulty: 1,
                            estimated_minutes: 15,
                            theory: "O ESP8266 é um microcontrolador WiFi popular para projetos IoT. Nesta lição, você aprenderá como exibir mensagens no console usando a função print(). O console é fundamental para debug e monitoramento de seus programas IoT.",
                            starter_code: "# Escreva seu código aqui\nprint('Seu nome aqui')",
                            solution_code: "# Solução completa\nprint('Olá, ESP8266!')\nprint('Meu primeiro programa IoT!')\nprint('Sistema iniciado com sucesso!')",
                            test_cases: [
                                {
                                    description: "Deve imprimir pelo menos 3 linhas",
                                    expected_output_lines: 3,
                                    points: 20
                                },
                                {
                                    description: "Deve mencionar ESP8266",
                                    expected_output_contains: "ESP8266",
                                    points: 30
                                }
                            ],
                            hints: [
                                "Use print() para exibir texto no console",
                                "Você pode usar múltiplas chamadas print()",
                                "Inclua 'ESP8266' em pelo menos uma mensagem"
                            ]
                        },
                        {
                            id: "1.2", 
                            title: "Variáveis e Tipos de Dados",
                            description: "Trabalhe com diferentes tipos de dados",
                            xp_points: 75,
                            difficulty: 2,
                            estimated_minutes: 20,
                            prerequisites: ["1.1"],
                            theory: "Variáveis armazenam dados que podem ser usados no seu programa. Python suporta vários tipos: strings (texto), números (int, float), booleanos (True/False), etc. Em projetos IoT, você frequentemente trabalhará com dados de sensores.",
                            starter_code: "# Declare variáveis para um sensor\ntemperatura = 0\nhumidade = 0\nsensor_ativo = False\n\n# Complete o código...",
                            solution_code: "# Dados do sensor\ntemperatura = 23.5\nhumidade = 65.2\nsensor_ativo = True\nnome_sensor = 'DHT22'\n\nprint(f'Sensor: {nome_sensor}')\nprint(f'Temperatura: {temperatura}°C')\nprint(f'Umidade: {humidade}%')\nprint(f'Status: {\"Ativo\" if sensor_ativo else \"Inativo\"}')",
                            test_cases: [
                                {
                                    description: "Deve usar variáveis numéricas",
                                    expected_variables: ["temperatura", "humidade"],
                                    points: 25
                                },
                                {
                                    description: "Deve usar variável booleana",
                                    expected_variables: ["sensor_ativo"],
                                    points: 25
                                },
                                {
                                    description: "Deve exibir dados formatados",
                                    expected_output_contains: ["°C", "%"],
                                    points: 25
                                }
                            ],
                            hints: [
                                "Use números decimais para temperatura e umidade",
                                "sensor_ativo deve ser True ou False",
                                "Use f-strings para formatação: f'Texto {variavel}'"
                            ]
                        },
                        {
                            id: "1.3",
                            title: "Loops e Controle de Fluxo", 
                            description: "Use loops e condicionais",
                            xp_points: 100,
                            difficulty: 3,
                            estimated_minutes: 30,
                            prerequisites: ["1.2"],
                            theory: "Loops permitem repetir código, enquanto condicionais (if/else) controlam o fluxo baseado em condições. Essencial para automação IoT e resposta a sensores.",
                            starter_code: "# Simule leituras de sensor em loop\nimport time\n\n# Complete o código...",
                            solution_code: "# Simulação de leituras de sensor\nimport time\nimport random\n\nprint('Iniciando monitoramento...')\n\nfor i in range(5):\n    temp = 20 + random.uniform(-5, 10)\n    \n    if temp > 25:\n        status = 'ALERTA: Temperatura alta!'\n    elif temp < 15:\n        status = 'AVISO: Temperatura baixa'\n    else:\n        status = 'Normal'\n    \n    print(f'Leitura {i+1}: {temp:.1f}°C - {status}')\n    time.sleep(0.5)\n\nprint('Monitoramento finalizado')",
                            test_cases: [
                                {
                                    description: "Deve usar loop for",
                                    expected_code_contains: "for",
                                    points: 30
                                },
                                {
                                    description: "Deve usar condicional if",
                                    expected_code_contains: "if",
                                    points: 30
                                },
                                {
                                    description: "Deve gerar múltiplas leituras",
                                    expected_output_lines: 6,
                                    points: 40
                                }
                            ],
                            hints: [
                                "Use range() no loop for",
                                "Use random.uniform() para simular valores",
                                "Implemente condições para diferentes faixas de temperatura"
                            ]
                        }
                    ]
                },
                {
                    id: "module-2",
                    title: "Interação com Hardware",
                    description: "Controle LEDs, botões e sensores",
                    difficulty: "Iniciante/Intermediário",
                    estimated_hours: 12,
                    prerequisites: ["module-1"],
                    lessons: [
                        {
                            id: "2.1",
                            title: "Controle de Pinos GPIO",
                            description: "Aprenda a controlar pinos digitais",
                            xp_points: 100,
                            difficulty: 4,
                            estimated_minutes: 25,
                            prerequisites: ["1.3"],
                            theory: "Os pinos GPIO (General Purpose Input/Output) permitem que o ESP8266 interaja com o mundo físico. Você pode configurá-los como entrada (ler sensores) ou saída (controlar LEDs, relés).",
                            starter_code: "from machine import Pin\nimport time\n\n# Configure um LED no pino GPIO2\n# Complete o código...",
                            solution_code: "from machine import Pin\nimport time\n\n# LED no pino 2\nled = Pin(2, Pin.OUT)\n\nprint('Iniciando controle LED...')\n\nfor i in range(5):\n    led.on()\n    print(f'LED ligado - ciclo {i+1}')\n    time.sleep(1)\n    led.off()\n    print(f'LED desligado - ciclo {i+1}')\n    time.sleep(1)\n\nprint('Sequência completa!')",
                            test_cases: [
                                {
                                    description: "Deve importar Pin do machine",
                                    expected_code_contains: "from machine import Pin",
                                    points: 20
                                },
                                {
                                    description: "Deve configurar pino como saída",
                                    expected_code_contains: "Pin.OUT",
                                    points: 30
                                },
                                {
                                    description: "Deve controlar LED com on/off",
                                    expected_code_contains: ["led.on()", "led.off()"],
                                    points: 50
                                }
                            ],
                            hints: [
                                "Use Pin(2, Pin.OUT) para configurar saída",
                                "Use led.on() e led.off() para controlar",
                                "Adicione time.sleep() entre as mudanças"
                            ]
                        }
                    ]
                }
            ]
        };
    }

    loadAchievements() {
        return [
            {
                id: "first-hello",
                title: "Primeiro Hello World",
                description: "Complete sua primeira lição",
                icon: "👋",
                xp_reward: 25,
                condition: lesson => lesson === "1.1"
            },
            {
                id: "variables-master", 
                title: "Mestre das Variáveis",
                description: "Complete a lição de variáveis",
                icon: "🔤",
                xp_reward: 50,
                condition: lesson => lesson === "1.2"
            },
            {
                id: "loop-expert",
                title: "Especialista em Loops",
                description: "Complete a lição de loops",
                icon: "🔄",
                xp_reward: 75,
                condition: lesson => lesson === "1.3"
            },
            {
                id: "hardware-master", 
                title: "Mestre do Hardware",
                description: "Complete o módulo de hardware",
                icon: "🔧",
                xp_reward: 200,
                condition: lesson => lesson === "2.1"
            },
            {
                id: "speed-demon",
                title: "Demônio da Velocidade",
                description: "Complete 3 lições em um dia",
                icon: "⚡",
                xp_reward: 100,
                condition: () => false // Custom logic needed
            }
        ];
    }

    initializeDeviceState() {
        return {
            esp8266: {
                model: "ESP8266",
                power_on: false,
                memory: { total: 160, used: 45, free: 115 },
                pins: {
                    gpio0: { mode: "input", value: 1, connected: "button" },
                    gpio2: { mode: "output", value: 0, connected: "led" },
                    gpio4: { mode: "input", value: null, connected: "dht22" }
                },
                wifi: { connected: false, ssid: "", ip: "", signal_strength: 0 },
                mqtt: { connected: false, broker: "", client_id: "", subscribed_topics: [], published_count: 0 }
            }
        };
    }

    // Navigation and View Management
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Back to curriculum button
        const backBtn = document.getElementById('backToCurriculum');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.switchView('curriculum'));
        }
    }

    switchView(viewName) {
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        // Update view sections
        const sections = document.querySelectorAll('.view-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${viewName}View`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentView = viewName;

        // Special handling for dashboard
        if (viewName === 'dashboard') {
            this.updateDashboard();
        }
    }

    // Monaco Editor Setup
    setupMonacoEditor() {
        if (typeof require !== 'undefined') {
            require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
            require(['vs/editor/editor.main'], () => {
                this.initializeEditor();
            });
        } else {
            // Fallback to simple textarea if Monaco fails
            setTimeout(() => this.initializeEditor(), 100);
        }
    }

    initializeEditor() {
        const container = document.getElementById('codeEditor');
        if (!container) return;

        try {
            if (window.monaco) {
                this.editor = monaco.editor.create(container, {
                    value: '# Carregando...',
                    language: 'python',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    minimap: { enabled: false }
                });
            } else {
                // Fallback to textarea
                container.innerHTML = '<textarea id="fallbackEditor" style="width:100%;height:100%;font-family:monospace;padding:10px;border:none;outline:none;resize:none;background:#1e1e1e;color:#d4d4d4;"></textarea>';
                this.editor = {
                    getValue: () => document.getElementById('fallbackEditor').value,
                    setValue: (value) => { document.getElementById('fallbackEditor').value = value; }
                };
            }
        } catch (error) {
            console.error('Editor initialization failed:', error);
            this.setupFallbackEditor(container);
        }
    }

    setupFallbackEditor(container) {
        container.innerHTML = '<textarea id="fallbackEditor" style="width:100%;height:100%;font-family:monospace;padding:10px;border:none;outline:none;resize:none;background:#1e1e1e;color:#d4d4d4;"></textarea>';
        this.editor = {
            getValue: () => document.getElementById('fallbackEditor').value,
            setValue: (value) => { document.getElementById('fallbackEditor').value = value; }
        };
    }

    // Curriculum Rendering
    renderCurriculum() {
        const container = document.getElementById('curriculumGrid');
        if (!container) return;

        container.innerHTML = '';

        this.curriculum.modules.forEach(module => {
            const moduleCard = this.createModuleCard(module);
            container.appendChild(moduleCard);
        });
    }

    createModuleCard(module) {
        const card = document.createElement('div');
        card.className = 'module-card';
        
        const isLocked = this.isModuleLocked(module);
        const completedLessons = this.getCompletedLessonsInModule(module);
        const isCompleted = completedLessons === module.lessons.length;
        
        if (isLocked) card.classList.add('locked');
        if (isCompleted) card.classList.add('completed');

        const progressPercent = (completedLessons / module.lessons.length) * 100;

        // Create lessons list container
        const lessonsContainer = document.createElement('div');
        lessonsContainer.className = 'lessons-list';

        // Add lessons to container
        module.lessons.forEach(lesson => {
            const lessonElement = this.createLessonItemElement(lesson, isLocked);
            lessonsContainer.appendChild(lessonElement);
        });

        card.innerHTML = `
            <div class="module-header">
                <div>
                    <h3 class="module-title">${module.title}</h3>
                    <p class="module-description">${module.description}</p>
                </div>
            </div>
            <div class="module-meta">
                <span class="meta-badge">
                    <span>📊</span>
                    ${module.difficulty}
                </span>
                <span class="meta-badge">
                    <span>⏱️</span>
                    ${module.estimated_hours}h estimadas
                </span>
                <span class="meta-badge">
                    <span>📚</span>
                    ${module.lessons.length} lições
                </span>
            </div>
        `;

        // Add lessons container
        card.appendChild(lessonsContainer);

        // Add progress section
        const progressSection = document.createElement('div');
        progressSection.className = 'module-progress';
        progressSection.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
                <span>${completedLessons}/${module.lessons.length} concluídas</span>
                <span>${Math.round(progressPercent)}%</span>
            </div>
        `;
        card.appendChild(progressSection);

        return card;
    }

    createLessonItemElement(lesson, moduleIsLocked) {
        const isCompleted = this.userProgress.completed_lessons.includes(lesson.id);
        const isLocked = moduleIsLocked || this.isLessonLocked(lesson);
        const isCurrent = this.userProgress.current_lesson === lesson.id;

        let statusClass = 'locked';
        let statusIcon = '🔒';
        
        if (isCompleted) {
            statusClass = 'completed';
            statusIcon = '✅';
        } else if (isCurrent && !isLocked) {
            statusClass = 'current';
            statusIcon = '▶️';
        } else if (!isLocked) {
            statusClass = 'available';
            statusIcon = '⭕';
        }

        const lessonElement = document.createElement('div');
        lessonElement.className = `lesson-item ${statusClass}`;
        lessonElement.innerHTML = `
            <div class="lesson-info">
                <div class="lesson-status ${statusClass}">
                    ${statusIcon}
                </div>
                <div>
                    <div class="lesson-title">${lesson.title}</div>
                    <div style="font-size: 11px; color: var(--color-text-secondary);">${lesson.description}</div>
                </div>
            </div>
            <div class="lesson-xp">+${lesson.xp_points} XP</div>
        `;

        if (!isLocked) {
            lessonElement.style.cursor = 'pointer';
            lessonElement.addEventListener('click', () => {
                this.startLesson(lesson.id);
            });
        }

        return lessonElement;
    }

    isModuleLocked(module) {
        if (!module.prerequisites || module.prerequisites.length === 0) return false;
        
        return module.prerequisites.some(prerequisiteId => {
            const prerequisiteModule = this.curriculum.modules.find(m => m.id === prerequisiteId);
            if (!prerequisiteModule) return false;
            
            const completedInPrereq = this.getCompletedLessonsInModule(prerequisiteModule);
            return completedInPrereq < prerequisiteModule.lessons.length;
        });
    }

    isLessonLocked(lesson) {
        if (!lesson.prerequisites || lesson.prerequisites.length === 0) return false;
        
        return lesson.prerequisites.some(prerequisiteId => {
            return !this.userProgress.completed_lessons.includes(prerequisiteId);
        });
    }

    getCompletedLessonsInModule(module) {
        return module.lessons.filter(lesson => 
            this.userProgress.completed_lessons.includes(lesson.id)
        ).length;
    }

    // Achievements Rendering
    renderAchievements() {
        const container = document.getElementById('achievementsGrid');
        if (!container) return;

        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const achievementCard = this.createAchievementCard(achievement);
            container.appendChild(achievementCard);
        });
    }

    createAchievementCard(achievement) {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        
        const isEarned = this.userProgress.badges_earned.includes(achievement.id);
        
        if (isEarned) {
            card.classList.add('earned');
        } else {
            card.classList.add('locked');
        }

        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-title">${achievement.title}</h4>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-xp">
                <span>⚡</span>
                +${achievement.xp_reward} XP
            </div>
        `;

        return card;
    }

    // Lesson Management
    startLesson(lessonId) {
        const lesson = this.findLesson(lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.userProgress.current_lesson = lessonId;
        this.saveUserProgress();

        this.loadLessonContent(lesson);
        this.switchView('practice');
    }

    findLesson(lessonId) {
        for (const module of this.curriculum.modules) {
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    }

    loadLessonContent(lesson) {
        // Update header
        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('lessonDifficulty').innerHTML = `⭐ ${lesson.difficulty}/5`;
        document.getElementById('lessonTime').innerHTML = `⏱️ ${lesson.estimated_minutes}min`;
        document.getElementById('lessonXP').innerHTML = `⚡ +${lesson.xp_points} XP`;

        // Update theory
        document.getElementById('theoryContent').innerHTML = `<p>${lesson.theory}</p>`;

        // Load starter code
        if (this.editor) {
            this.editor.setValue(lesson.starter_code);
        }

        // Clear console and tests
        this.clearConsole();
        this.clearTestResults();
        
        // Make sure completion modal is hidden
        this.closeCompletionModal();
    }

    // Event Listeners
    setupEventListeners() {
        // Code execution buttons
        const runCodeBtn = document.getElementById('runCode');
        const runTestsBtn = document.getElementById('runTests');
        const resetCodeBtn = document.getElementById('resetCode');
        const showHintBtn = document.getElementById('showHint');

        if (runCodeBtn) {
            runCodeBtn.addEventListener('click', () => this.executeCode());
        }

        if (runTestsBtn) {
            runTestsBtn.addEventListener('click', () => this.runTests());
        }

        if (resetCodeBtn) {
            resetCodeBtn.addEventListener('click', () => this.resetCode());
        }

        if (showHintBtn) {
            showHintBtn.addEventListener('click', () => this.showHint());
        }

        // Output panel tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchOutputTab(tabName);
            });
        });

        // Modal buttons
        const nextLessonBtn = document.getElementById('nextLesson');
        const reviewLessonBtn = document.getElementById('reviewLesson');
        const modal = document.getElementById('completionModal');
        const modalOverlay = modal?.querySelector('.modal-overlay');

        if (nextLessonBtn) {
            nextLessonBtn.addEventListener('click', () => this.goToNextLesson());
        }

        if (reviewLessonBtn) {
            reviewLessonBtn.addEventListener('click', () => this.closeCompletionModal());
        }

        // Close modal when clicking overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeCompletionModal());
        }

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCompletionModal();
            }
        });
    }

    // Code Execution
    executeCode() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        this.clearConsole();
        this.updateDeviceState(true);

        // Simulate code execution
        this.addConsoleOutput('🚀 Executando código...', 'info');
        
        setTimeout(() => {
            try {
                const output = this.simulateCodeExecution(code);
                this.displayExecutionOutput(output);
            } catch (error) {
                this.addConsoleOutput(`❌ Erro: ${error.message}`, 'error');
            }
        }, 500);
    }

    simulateCodeExecution(code) {
        const lines = code.split('\n');
        const output = [];
        
        // Simulate basic Python execution
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('print(')) {
                const content = this.extractPrintContent(trimmed);
                if (content) {
                    output.push(content);
                }
            } else if (trimmed.startsWith('from machine import Pin')) {
                output.push('📌 Configurando pinos GPIO...');
                this.updateGPIOState();
            } else if (trimmed.includes('led.on()')) {
                output.push('💡 LED ligado');
                this.updatePinVisual('gpio2', true);
            } else if (trimmed.includes('led.off()')) {
                output.push('💡 LED desligado');
                this.updatePinVisual('gpio2', false);
            } else if (trimmed.includes('time.sleep(')) {
                output.push('⏱️ Aguardando...');
            }
        }

        return output;
    }

    extractPrintContent(line) {
        try {
            const match = line.match(/print\(['"`]([^'"`]+)['"`]\)/);
            if (match) return match[1];
            
            // Handle f-strings and variables (simplified)
            const fStringMatch = line.match(/print\(f?['"`]([^'"`]+)['"`]\)/);
            if (fStringMatch) return fStringMatch[1].replace(/\{[^}]+\}/g, '[valor]');
            
            return 'Saída do programa';
        } catch {
            return 'Saída do programa';  
        }
    }

    displayExecutionOutput(output) {
        if (output.length === 0) {
            this.addConsoleOutput('✅ Código executado (sem saída)', 'success');
        } else {
            output.forEach(line => {
                this.addConsoleOutput(line, 'success');
            });
        }
        this.addConsoleOutput('✅ Execução finalizada', 'info');
    }

    // Test System
    runTests() {
        if (!this.editor || !this.currentLesson) return;

        const code = this.editor.getValue();
        this.clearTestResults();

        this.addTestInfo('🧪 Executando testes...');

        setTimeout(() => {
            const results = this.executeTests(code, this.currentLesson.test_cases);
            this.displayTestResults(results);
            
            if (results.allPassed) {
                this.completeLesson();
            }
        }, 1000);
    }

    executeTests(code, testCases) {
        const results = {
            passed: 0,
            total: testCases.length,
            allPassed: false,
            testResults: [],
            totalPoints: 0,
            earnedPoints: 0
        };

        testCases.forEach((testCase, index) => {
            const result = this.executeTestCase(code, testCase, index);
            results.testResults.push(result);
            results.totalPoints += testCase.points;
            
            if (result.passed) {
                results.passed++;
                results.earnedPoints += testCase.points;
            }
        });

        results.allPassed = results.passed === results.total;
        return results;
    }

    executeTestCase(code, testCase, index) {
        let passed = false;
        let feedback = '';

        try {
            if (testCase.expected_output_lines) {
                const outputLines = this.countOutputLines(code);
                passed = outputLines >= testCase.expected_output_lines;
                feedback = passed 
                    ? `✅ Código produz ${outputLines} linhas de saída`
                    : `❌ Esperado pelo menos ${testCase.expected_output_lines} linhas, encontrado ${outputLines}`;
            }
            
            if (testCase.expected_output_contains) {
                const hasContent = this.codeContainsOutput(code, testCase.expected_output_contains);
                passed = hasContent;
                feedback = passed 
                    ? `✅ Saída contém "${testCase.expected_output_contains}"`
                    : `❌ Saída deve conter "${testCase.expected_output_contains}"`;
            }
            
            if (testCase.expected_code_contains) {
                const codeContents = Array.isArray(testCase.expected_code_contains) 
                    ? testCase.expected_code_contains 
                    : [testCase.expected_code_contains];
                    
                passed = codeContents.every(content => code.includes(content));
                feedback = passed 
                    ? `✅ Código contém elementos necessários`
                    : `❌ Código deve conter: ${codeContents.join(', ')}`;
            }
            
            if (testCase.expected_variables) {
                const hasVariables = testCase.expected_variables.every(variable => 
                    code.includes(variable + ' =') || code.includes(variable + '=')
                );
                passed = hasVariables;
                feedback = passed 
                    ? `✅ Variáveis corretas definidas`
                    : `❌ Defina as variáveis: ${testCase.expected_variables.join(', ')}`;
            }

        } catch (error) {
            passed = false;
            feedback = `❌ Erro no teste: ${error.message}`;
        }

        return {
            passed,
            feedback,
            description: testCase.description,
            points: testCase.points
        };
    }

    countOutputLines(code) {
        const printMatches = code.match(/print\(/g);
        return printMatches ? printMatches.length : 0;
    }

    codeContainsOutput(code, expectedContent) {
        return code.toLowerCase().includes(expectedContent.toLowerCase());
    }

    // UI Updates
    addConsoleOutput(message, type = 'normal') {
        const console = document.getElementById('consoleOutput');
        if (!console) return;

        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = message;
        console.appendChild(line);
        console.scrollTop = console.scrollHeight;
    }

    clearConsole() {
        const console = document.getElementById('consoleOutput');
        if (console) {
            console.innerHTML = '<div class="output-line info">ESP8266 Academy - Console Output</div>';
        }
    }

    addTestInfo(message) {
        const testResults = document.getElementById('testResults');
        if (!testResults) return;

        testResults.innerHTML = `<div class="test-info">${message}</div>`;
    }

    displayTestResults(results) {
        const container = document.getElementById('testResults');
        if (!container) return;

        let html = `
            <div class="test-summary">
                <h4>Resultados dos Testes</h4>
                <p>Aprovado: ${results.passed}/${results.total} | Pontos: ${results.earnedPoints}/${results.totalPoints}</p>
            </div>
        `;

        results.testResults.forEach((result, index) => {
            html += `
                <div class="test-case ${result.passed ? 'passed' : 'failed'}">
                    <div class="test-header">
                        <span class="test-description">${result.description}</span>
                        <span class="test-status ${result.passed ? 'passed' : 'failed'}">
                            ${result.passed ? '✅' : '❌'} ${result.points} pontos
                        </span>
                    </div>
                    <div class="test-details">${result.feedback}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.switchOutputTab('tests');
    }

    clearTestResults() {
        const container = document.getElementById('testResults');
        if (container) {
            container.innerHTML = '<div class="test-info">Clique em "Testar" para validar sua solução...</div>';
        }
    }

    switchOutputTab(tabName) {
        // Update tab buttons
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach(pane => {
            pane.classList.remove('active');
        });

        const targetPane = document.getElementById(`${tabName}Tab`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }

    // Device Simulation
    updateDeviceState(powerOn) {
        this.deviceState.esp8266.power_on = powerOn;
        
        const powerIndicator = document.getElementById('devicePower');
        if (powerIndicator) {
            powerIndicator.textContent = powerOn ? '🟢' : '🔴';
            const statusText = powerIndicator.nextElementSibling;
            if (statusText) {
                statusText.textContent = powerOn ? 'Ligado' : 'Desligado';
            }
        }
        
        if (powerOn) {
            this.deviceState.esp8266.memory.used = 45 + Math.floor(Math.random() * 20);
            this.updateMemoryDisplay();
        }
    }

    updateGPIOState() {
        this.addConsoleOutput('📋 GPIO configurado com sucesso', 'info');
    }

    updatePinVisual(pin, state) {
        const pinElement = document.querySelector(`[data-gpio="${pin.replace('gpio', '')}"] .pin-status`);
        if (pinElement) {
            pinElement.classList.toggle('on', state);
            pinElement.classList.toggle('off', !state);
        }
        
        this.deviceState.esp8266.pins[pin].value = state ? 1 : 0;
    }

    updateMemoryDisplay() {
        const memoryUsage = document.getElementById('memoryUsage');
        const memoryFill = document.getElementById('memoryFill');
        
        if (memoryUsage && memoryFill) {
            const used = this.deviceState.esp8266.memory.used;
            const total = this.deviceState.esp8266.memory.total;
            const percentage = (used / total) * 100;
            
            memoryUsage.textContent = `${used}/${total} KB`;
            memoryFill.style.width = `${percentage}%`;
        }
    }

    // Lesson Completion
    completeLesson() {
        if (!this.currentLesson) return;

        const lessonId = this.currentLesson.id;
        
        // Add to completed lessons
        if (!this.userProgress.completed_lessons.includes(lessonId)) {
            this.userProgress.completed_lessons.push(lessonId);
        }

        // Award XP
        const earnedXP = this.currentLesson.xp_points;
        this.userProgress.total_xp += earnedXP;

        // Check for level up
        const newLevel = Math.floor(this.userProgress.total_xp / 200) + 1;
        const leveledUp = newLevel > this.userProgress.current_level;
        this.userProgress.current_level = newLevel;

        // Check for achievements
        const newBadges = this.checkAchievements(lessonId);

        // Update next lesson
        this.setNextLesson();

        // Save progress
        this.saveUserProgress();

        // Show completion modal
        this.showCompletionModal(earnedXP, newBadges, leveledUp);

        // Update UI
        this.updateUserStats();
        this.renderCurriculum();
    }

    checkAchievements(lessonId) {
        const newBadges = [];
        
        this.achievements.forEach(achievement => {
            if (!this.userProgress.badges_earned.includes(achievement.id)) {
                if (achievement.condition(lessonId)) {
                    this.userProgress.badges_earned.push(achievement.id);
                    this.userProgress.total_xp += achievement.xp_reward;
                    newBadges.push(achievement);
                }
            }
        });

        return newBadges;
    }

    setNextLesson() {
        const currentModule = this.curriculum.modules.find(m => 
            m.lessons.some(l => l.id === this.currentLesson.id)
        );
        
        if (!currentModule) return;

        const currentIndex = currentModule.lessons.findIndex(l => l.id === this.currentLesson.id);
        
        if (currentIndex < currentModule.lessons.length - 1) {
            // Next lesson in same module
            this.userProgress.current_lesson = currentModule.lessons[currentIndex + 1].id;
        } else {
            // Next module's first lesson
            const moduleIndex = this.curriculum.modules.findIndex(m => m.id === currentModule.id);
            if (moduleIndex < this.curriculum.modules.length - 1) {
                const nextModule = this.curriculum.modules[moduleIndex + 1];
                this.userProgress.current_lesson = nextModule.lessons[0].id;
            }
        }
    }

    showCompletionModal(earnedXP, newBadges, leveledUp) {
        const modal = document.getElementById('completionModal');
        if (!modal) return;

        // Update earned XP
        const earnedXPElement = document.getElementById('earnedXP');
        if (earnedXPElement) {
            earnedXPElement.textContent = earnedXP;
        }
        
        const lessonScoreElement = document.getElementById('lessonScore');
        if (lessonScoreElement) {
            lessonScoreElement.textContent = '100%';
        }

        // Show new badges
        const badgesContainer = document.getElementById('newBadges');
        if (badgesContainer) {
            if (newBadges.length > 0) {
                badgesContainer.innerHTML = '<h4>🎉 Novas Conquistas!</h4>' + 
                    newBadges.map(badge => 
                        `<div class="badge-earned">
                            <span>${badge.icon}</span>
                            <span>${badge.title}</span>
                        </div>`
                    ).join('');
            } else {
                badgesContainer.innerHTML = '';
            }
        }

        modal.classList.remove('hidden');
    }

    closeCompletionModal() {
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    goToNextLesson() {
        this.closeCompletionModal();
        const nextLessonId = this.userProgress.current_lesson;
        if (nextLessonId && this.findLesson(nextLessonId)) {
            this.startLesson(nextLessonId);
        } else {
            this.switchView('curriculum');
            this.showToast('🎉 Parabéns! Você completou todos os conteúdos disponíveis!', 'success');
        }
    }

    // Utility Functions
    resetCode() {
        if (this.editor && this.currentLesson) {
            this.editor.setValue(this.currentLesson.starter_code);
            this.clearConsole();
            this.clearTestResults();
            this.updateDeviceState(false);
        }
    }

    showHint() {
        if (!this.currentLesson || !this.currentLesson.hints) return;

        const hints = this.currentLesson.hints;
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        this.showToast(`💡 Dica: ${randomHint}`, 'info');
    }

    updateUserStats() {
        const userXPElement = document.getElementById('userXP');
        if (userXPElement) {
            userXPElement.textContent = this.userProgress.total_xp;
        }
        
        const userLevelElement = document.getElementById('userLevel');
        if (userLevelElement) {
            userLevelElement.textContent = this.userProgress.current_level;
        }
        
        const userStreakElement = document.getElementById('userStreak');
        if (userStreakElement) {
            userStreakElement.textContent = this.userProgress.streak_days;
        }
        
        // Update overview stats
        const completedLessonsElement = document.getElementById('completedLessons');
        if (completedLessonsElement) {
            completedLessonsElement.textContent = this.userProgress.completed_lessons.length;
        }
        
        const totalBadgesElement = document.getElementById('totalBadges');
        if (totalBadgesElement) {
            totalBadgesElement.textContent = this.userProgress.badges_earned.length;
        }
        
        const completedModules = this.curriculum.modules.filter(module => 
            this.getCompletedLessonsInModule(module) === module.lessons.length
        ).length;
        
        const completedModulesElement = document.getElementById('completedModules');
        if (completedModulesElement) {
            completedModulesElement.textContent = completedModules;
        }
    }

    updateDashboard() {
        // Update weekly stats (simulated)
        const weeklyLessonsElement = document.getElementById('weeklyLessons');
        if (weeklyLessonsElement) {
            weeklyLessonsElement.textContent = Math.min(this.userProgress.completed_lessons.length, 7);
        }
        
        const weeklyXPElement = document.getElementById('weeklyXP');
        if (weeklyXPElement) {
            weeklyXPElement.textContent = Math.min(this.userProgress.total_xp, 500);
        }
        
        const avgScoreElement = document.getElementById('avgScore');
        if (avgScoreElement) {
            avgScoreElement.textContent = '95%';
        }

        // Update user badges
        this.updateUserBadges();
        this.updateRecentActivity();
        this.updateProgressChart();
    }

    updateUserBadges() {
        const container = document.getElementById('userBadges');
        if (!container) return;

        const earnedAchievements = this.achievements.filter(a => 
            this.userProgress.badges_earned.includes(a.id)
        );

        if (earnedAchievements.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">Nenhuma badge conquistada ainda</p>';
            return;
        }

        container.innerHTML = earnedAchievements.map(achievement => 
            `<div class="user-badge">
                <span>${achievement.icon}</span>
                <span>${achievement.title}</span>
            </div>`
        ).join('');
    }

    updateRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const activities = [
            { icon: '📚', text: 'Completou lição "Hello World"', time: '2 horas atrás' },
            { icon: '⚡', text: 'Ganhou 50 XP', time: '2 horas atrás' },
            { icon: '🏆', text: 'Conquistou badge "Primeiro Hello World"', time: '3 horas atrás' }
        ];

        container.innerHTML = activities.map(activity => 
            `<div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>`
        ).join('');
    }

    updateProgressChart() {
        const canvas = document.getElementById('progressChart');
        if (!canvas || !window.Chart) return;

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Restante'],
                datasets: [{
                    data: [this.userProgress.completed_lessons.length, 20 - this.userProgress.completed_lessons.length],
                    backgroundColor: ['#1FB8CD', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = {
            success: '✅',
            error: '❌',
            info: '💡',
            warning: '⚠️'
        }[type] || 'ℹ️';

        toast.className = `toast ${type}`;
        
        const toastIcon = toast.querySelector('.toast-icon');
        if (toastIcon) {
            toastIcon.textContent = icon;
        }
        
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.academy = new ESP8266Academy();
});