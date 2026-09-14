const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, '../src/i18n/translations.ts');

const newKeys = [
  "'onboarding.s0InfoGentle'?: string;",
  "'onboarding.s0InfoBalanced'?: string;",
  "'onboarding.s0InfoChallenging'?: string;",
  "'onboarding.s0InfoGentleDesc'?: string;",
  "'onboarding.s0InfoBalancedDesc'?: string;",
  "'onboarding.s0InfoChallengingDesc'?: string;",
  "'onboarding.s0InfoAssist'?: string;",
  "'onboarding.s1Hint5'?: string;",
  "'onboarding.s1Hint10'?: string;",
  "'onboarding.s1Hint15'?: string;",
  "'onboarding.s1Hint20'?: string;",
];

const dataByLang = {
  'en': {
    'onboarding.s0InfoGentle': 'You will start with gentle puzzles',
    'onboarding.s0InfoBalanced': 'You will start with balanced puzzles',
    'onboarding.s0InfoChallenging': 'You will start with challenging puzzles',
    'onboarding.s0InfoGentleDesc': 'Perfect for learning the rules and building confidence.',
    'onboarding.s0InfoBalancedDesc': 'A thoughtful mix of focus, logic, and satisfying progress.',
    'onboarding.s0InfoChallengingDesc': 'Designed to stretch your logic and sharpen advanced skills.',
    'onboarding.s0InfoAssist': 'Smart assists will adjust as your skills improve.',
    'onboarding.s1Hint5': '🌱 Casual: Quick 5-minute mental warm-up',
    'onboarding.s1Hint10': '⭐ Recommended: Perfect for 1 Daily Challenge',
    'onboarding.s1Hint15': '🧠 Brain Workout: 2 Puzzles + deeper focus',
    'onboarding.s1Hint20': '👑 Master Level: Serious cognitive endurance',
  },
  'zh-CN': {
    'onboarding.s0InfoGentle': '您将从温和谜题开始',
    'onboarding.s0InfoBalanced': '您将从适中谜题开始',
    'onboarding.s0InfoChallenging': '您将从高难谜题开始',
    'onboarding.s0InfoGentleDesc': '适合熟悉规则并建立自信。',
    'onboarding.s0InfoBalancedDesc': '专注与逻辑的完美融合，稳步提升。',
    'onboarding.s0InfoChallengingDesc': '挑战逻辑极限，磨练高阶技巧。',
    'onboarding.s0InfoAssist': '智能辅助会随着技巧提升自适应调整。',
    'onboarding.s1Hint5': '🌱 休闲：5分钟快速大脑热身',
    'onboarding.s1Hint10': '⭐ 推荐：正好完成1个每日挑战',
    'onboarding.s1Hint15': '🧠 健脑：2道谜题 + 深度沉浸',
    'onboarding.s1Hint20': '👑 大师：高强度认知耐力锻炼',
  },
  'ja': {
    'onboarding.s0InfoGentle': 'やさしいパズルから始めます',
    'onboarding.s0InfoBalanced': 'バランスの取れたパズルから始めます',
    'onboarding.s0InfoChallenging': '手応えのあるパズルから始めます',
    'onboarding.s0InfoGentleDesc': 'ルールを覚えて自信をつけるのに最適です。',
    'onboarding.s0InfoBalancedDesc': '集中力とロジックを心地よく鍛えられます。',
    'onboarding.s0InfoChallengingDesc': '論理力を極限まで高め、高度な解法を磨きます。',
    'onboarding.s0InfoAssist': '上達に合わせてスマートアシストが自動調整されます。',
    'onboarding.s1Hint5': '🌱 カジュアル：5分間のクイック脳トレ',
    'onboarding.s1Hint10': '⭐ おすすめ：デイリーチャレンジ1問に最適',
    'onboarding.s1Hint15': '🧠 脳トレ：2問でさらに深い集中',
    'onboarding.s1Hint20': '👑 マスター：本格的な認知耐久力トレーニング',
  },
  'ko': {
    'onboarding.s0InfoGentle': '가벼운 퍼즐로 시작합니다',
    'onboarding.s0InfoBalanced': '균형 잡힌 퍼즐로 시작합니다',
    'onboarding.s0InfoChallenging': '도전적인 퍼즐로 시작합니다',
    'onboarding.s0InfoGentleDesc': '규칙을 익히고 자신감을 키우기에 이상적입니다.',
    'onboarding.s0InfoBalancedDesc': '집중력과 논리를 탄탄하게 다지는 만족스러운 진행.',
    'onboarding.s0InfoChallengingDesc': '논리적 한계를 넓히고 고급 스킬을 연마합니다.',
    'onboarding.s0InfoAssist': '실력 향상에 맞춰 스마트 도우미가 자동 조절됩니다.',
    'onboarding.s1Hint5': '🌱 캐주얼: 5분 가벼운 두뇌 워밍업',
    'onboarding.s1Hint10': '⭐ 추천: 일일 챌린지 1개에 딱 맞는 시간',
    'onboarding.s1Hint15': '🧠 두뇌 운동: 퍼즐 2개 + 깊은 몰입',
    'onboarding.s1Hint20': '👑 마스터: 본격적인 인지 지구력 훈련',
  },
  'es': {
    'onboarding.s0InfoGentle': 'Comenzarás con puzles suaves',
    'onboarding.s0InfoBalanced': 'Comenzarás con puzles equilibrados',
    'onboarding.s0InfoChallenging': 'Comenzarás con puzles desafiantes',
    'onboarding.s0InfoGentleDesc': 'Perfecto para aprender las reglas y ganar confianza.',
    'onboarding.s0InfoBalancedDesc': 'Una mezcla reflexiva de concentración y lógica.',
    'onboarding.s0InfoChallengingDesc': 'Diseñado para estirar tu lógica y dominar técnicas avanzadas.',
    'onboarding.s0InfoAssist': 'Las ayudas inteligentes se adaptarán a medida que mejores.',
    'onboarding.s1Hint5': '🌱 Casual: calentamiento mental rápido de 5 minutos',
    'onboarding.s1Hint10': '⭐ Recomendado: perfecto para 1 desafío diario',
    'onboarding.s1Hint15': '🧠 Entrenamiento cerebral: 2 puzles y mayor concentración',
    'onboarding.s1Hint20': '👑 Nivel Maestro: resistencia cognitiva seria',
  },
  'de': {
    'onboarding.s0InfoGentle': 'Du beginnst mit leichten Rätseln',
    'onboarding.s0InfoBalanced': 'Du beginnst mit ausgewogenen Rätseln',
    'onboarding.s0InfoChallenging': 'Du beginnst mit anspruchsvollen Rätseln',
    'onboarding.s0InfoGentleDesc': 'Perfekt, um die Regeln zu lernen und Sicherheit aufzubauen.',
    'onboarding.s0InfoBalancedDesc': 'Eine gelungene Mischung aus Fokus, Logik und Erfolgserlebnissen.',
    'onboarding.s0InfoChallengingDesc': 'Entwickelt, um logische Grenzen zu testen und Fähigkeiten zu schärfen.',
    'onboarding.s0InfoAssist': 'Intelligente Hilfen passen sich deinen Fortschritten an.',
    'onboarding.s1Hint5': '🌱 Locker: Schnelles 5-Minuten-Aufwärmen fürs Gehirn',
    'onboarding.s1Hint10': '⭐ Empfohlen: Perfekt für 1 tägliche Herausforderung',
    'onboarding.s1Hint15': '🧠 Gehirntraining: 2 Rätsel + tieferer Fokus',
    'onboarding.s1Hint20': '👑 Meisterstufe: Echte kognitive Ausdauer',
  },
  'fr': {
    'onboarding.s0InfoGentle': 'Vous commencerez par des grilles douces',
    'onboarding.s0InfoBalanced': 'Vous commencerez par des grilles équilibrées',
    'onboarding.s0InfoChallenging': 'Vous commencerez par des grilles stimulantes',
    'onboarding.s0InfoGentleDesc': 'Idéal pour apprendre les règles et prendre confiance.',
    'onboarding.s0InfoBalancedDesc': 'Un mélange équilibré de concentration et de logique.',
    'onboarding.s0InfoChallengingDesc': 'Conçu pour pousser votre logique et perfectionner vos compétences.',
    'onboarding.s0InfoAssist': "Les aides intelligentes s'ajusteront selon vos progrès.",
    'onboarding.s1Hint5': "🌱 Détente : 5 minutes d'échauffement cérébral rapide",
    'onboarding.s1Hint10': '⭐ Recommandé : Idéal pour 1 défi quotidien',
    'onboarding.s1Hint15': '🧠 Entraînement cérébral : 2 grilles + concentration accrue',
    'onboarding.s1Hint20': '👑 Niveau Expert : Endurance cognitive supérieure',
  },
  'pt-BR': {
    'onboarding.s0InfoGentle': 'Você começará com quebra-cabeças fáceis',
    'onboarding.s0InfoBalanced': 'Você começará com desafios equilibrados',
    'onboarding.s0InfoChallenging': 'Você começará com desafios estimulantes',
    'onboarding.s0InfoGentleDesc': 'Perfeito para aprender as regras e ganhar confiança.',
    'onboarding.s0InfoBalancedDesc': 'Mistura equilibrada de foco, lógica e satisfação.',
    'onboarding.s0InfoChallengingDesc': 'Projetado para desafiar seu raciocínio e aprimorar habilidades avançadas.',
    'onboarding.s0InfoAssist': 'As assistências inteligentes se ajustam conforme sua evolução.',
    'onboarding.s1Hint5': '🌱 Casual: Aquecimento mental rápido de 5 minutos',
    'onboarding.s1Hint10': '⭐ Recomendado: Ideal para 1 Desafio Diário',
    'onboarding.s1Hint15': '🧠 Treino Cerebral: 2 desafios + foco mais profundo',
    'onboarding.s1Hint20': '👑 Nível Mestre: Resistência cognitiva para valer',
  },
  'ru': {
    'onboarding.s0InfoGentle': 'Вы начнете с простых головоломок',
    'onboarding.s0InfoBalanced': 'Вы начнете со сбалансированных головоломок',
    'onboarding.s0InfoChallenging': 'Вы начнете со сложных головоломок',
    'onboarding.s0InfoGentleDesc': 'Идеально для освоения правил и обретения уверенности.',
    'onboarding.s0InfoBalancedDesc': 'Отличное сочетание внимания, логики и прогресса.',
    'onboarding.s0InfoChallengingDesc': 'Создано для развития логики и освоения продвинутых приемов.',
    'onboarding.s0InfoAssist': 'Умные подсказки подстраиваются под ваш рост.',
    'onboarding.s1Hint5': '🌱 Легкий: быстрая 5-минутная разминка',
    'onboarding.s1Hint10': '⭐ Рекомендуется: идеально для 1 ежедневного задания',
    'onboarding.s1Hint15': '🧠 Тренировка мозга: 2 головоломки + глубже фокус',
    'onboarding.s1Hint20': '👑 Мастер: тренировка когнитивной выносливости',
  },
  'it': {
    'onboarding.s0InfoGentle': 'Inizierai con schemi rilassanti',
    'onboarding.s0InfoBalanced': 'Inizierai con schemi bilanciati',
    'onboarding.s0InfoChallenging': 'Inizierai con schemi impegnativi',
    'onboarding.s0InfoGentleDesc': 'Perfetto per imparare le regole e acquisire sicurezza.',
    'onboarding.s0InfoBalancedDesc': 'Un mix armonioso di concentrazione, logica e soddisfazione.',
    'onboarding.s0InfoChallengingDesc': 'Ideato per stimolare la logica e affinare abilità avanzate.',
    'onboarding.s0InfoAssist': 'Gli aiuti intelligenti si adatteranno ai tuoi progressi.',
    'onboarding.s1Hint5': '🌱 Informale: riscaldamento mentale rapido di 5 minuti',
    'onboarding.s1Hint10': '⭐ Consigliato: perfetto per 1 sfida giornaliera',
    'onboarding.s1Hint15': '🧠 Esercizio mentale: 2 schemi + concentrazione più intensa',
    'onboarding.s1Hint20': '👑 Livello Maestro: resistenza cognitiva intensa',
  },
  'ar': {
    'onboarding.s0InfoGentle': 'ستبدأ بألغاز هادئة',
    'onboarding.s0InfoBalanced': 'ستبدأ بألغاز متوازنة',
    'onboarding.s0InfoChallenging': 'ستبدأ بألغاز حماسية صعبة',
    'onboarding.s0InfoGentleDesc': 'مثالي لتعلّم القواعد واكتساب الثقة.',
    'onboarding.s0InfoBalancedDesc': 'مزيج رائع من التركيز والمنطق والتطور السلس.',
    'onboarding.s0InfoChallengingDesc': 'مصمم لتطوير مهارات التفكير المنطقي المتقدمة.',
    'onboarding.s0InfoAssist': 'تتكيّف المساعدات الذكية تلقائياً مع تطور مهاراتك.',
    'onboarding.s1Hint5': '🌱 خفيف: إحماء ذهني سريع لمدة 5 دقائق',
    'onboarding.s1Hint10': '⭐ موصى به: مثالي لتحدي يومي واحد',
    'onboarding.s1Hint15': '🧠 تمرين العقل: لغزان + تركيز أعمق',
    'onboarding.s1Hint20': '👑 مستوى الخبير: تدريب متقدم على قوة التحمل الذهني',
  },
  'hi': {
    'onboarding.s0InfoGentle': 'आप सरल पहेलियों से शुरुआत करेंगे',
    'onboarding.s0InfoBalanced': 'आप संतुलित पहेलियों से शुरुआत करेंगे',
    'onboarding.s0InfoChallenging': 'आप चुनौतीपूर्ण पहेलियों से शुरुआत करेंगे',
    'onboarding.s0InfoGentleDesc': 'नियम सीखने और आत्मविश्वास बढ़ाने के लिए बिल्कुल सही।',
    'onboarding.s0InfoBalancedDesc': 'एकाग्रता, तर्क और संतुष्टिदायक प्रगति का बेहतरीन मेल।',
    'onboarding.s0InfoChallengingDesc': 'आपके तार्किक कौशल को निखारने और उच्च स्तर की तकनीकें सीखने के लिए।',
    'onboarding.s0InfoAssist': 'जैसे-जैसे आपकी कुशलता बढ़ेगी, स्मार्ट सहायता स्वतः अनुकूल होगी।',
    'onboarding.s1Hint5': '🌱 कैज़ुअल: 5 मिनट का त्वरित मानसिक वार्म-अप',
    'onboarding.s1Hint10': '⭐ अनुशंसित: 1 दैनिक चुनौती के लिए बिल्कुल उपयुक्त',
    'onboarding.s1Hint15': '🧠 दिमागी कसरत: 2 पहेलियाँ + गहरा फोकस',
    'onboarding.s1Hint20': '👑 मास्टर स्तर: गंभीर बौद्धिक क्षमता और एकाग्रता',
  },
  'id': {
    'onboarding.s0InfoGentle': 'Anda akan mulai dengan teka-teki santai',
    'onboarding.s0InfoBalanced': 'Anda akan mulai dengan teka-teki seimbang',
    'onboarding.s0InfoChallenging': 'Anda akan mulai dengan teka-teki menantang',
    'onboarding.s0InfoGentleDesc': 'Sangat cocok untuk mempelajari aturan dan membangun rasa percaya diri.',
    'onboarding.s0InfoBalancedDesc': 'Kombinasi fokus, logika, dan kemajuan yang memuaskan.',
    'onboarding.s0InfoChallengingDesc': 'Dirancang untuk melatih logika dan mengasah kemampuan tingkat lanjut.',
    'onboarding.s0InfoAssist': 'Bantuan pintar akan menyesuaikan seiring meningkatnya kemampuan Anda.',
    'onboarding.s1Hint5': '🌱 Santai: Pemanasan otak kilat 5 menit',
    'onboarding.s1Hint10': '⭐ Disarankan: Pas untuk 1 Tantangan Harian',
    'onboarding.s1Hint15': '🧠 Latihan Otak: 2 Teka-teki + fokus mendalam',
    'onboarding.s1Hint20': '👑 Tingkat Master: Ketahanan kognitif tingkat tinggi',
  },
  'tr': {
    'onboarding.s0InfoGentle': 'Hafif bulmacalarla başlayacaksın',
    'onboarding.s0InfoBalanced': 'Dengeli bulmacalarla başlayacaksın',
    'onboarding.s0InfoChallenging': 'Zorlu bulmacalarla başlayacaksın',
    'onboarding.s0InfoGentleDesc': 'Kuralları öğrenmek ve özgüven kazanmak için ideal.',
    'onboarding.s0InfoBalancedDesc': 'Odaklanma, mantık ve tatmin edici bir ilerlemenin harika karışımı.',
    'onboarding.s0InfoChallengingDesc': 'Mantığını zorlamak ve ileri seviye becerileri geliştirmek için tasarlandı.',
    'onboarding.s0InfoAssist': 'Akıllı yardımlar becerileriniz geliştikçe otomatik uyum sağlar.',
    'onboarding.s1Hint5': '🌱 Rahat: 5 dakikalık hızlı zihin ısınması',
    'onboarding.s1Hint10': '⭐ Tavsiye: 1 Günlük Görev için tam ideal',
    'onboarding.s1Hint15': '🧠 Zihin Egzersizi: 2 Bulmaca + daha derin odaklanma',
    'onboarding.s1Hint20': '👑 Usta Seviye: Ciddi zihinsel dayanıklılık',
  },
  'th': {
    'onboarding.s0InfoGentle': 'คุณจะเริ่มต้นด้วยปริศนาระดับง่าย',
    'onboarding.s0InfoBalanced': 'คุณจะเริ่มต้นด้วยปริศนาระดับสมดุล',
    'onboarding.s0InfoChallenging': 'คุณจะเริ่มต้นด้วยปริศนาระดับท้าทาย',
    'onboarding.s0InfoGentleDesc': 'เหมาะอย่างยิ่งสำหรับการเรียนรู้กฎและสร้างความมั่นใจ',
    'onboarding.s0InfoBalancedDesc': 'การผสมผสานระหว่างสมาธิ ตรรกะ และความก้าวหน้าที่น่าพึงพอใจ',
    'onboarding.s0InfoChallengingDesc': 'ออกแบบมาเพื่อท้าทายตรรกะและฝึกฝนทักษะขั้นสูง',
    'onboarding.s0InfoAssist': 'ระบบช่วยเหลืออัจฉริยะจะปรับตามทักษะที่เพิ่มขึ้นของคุณ',
    'onboarding.s1Hint5': '🌱 ผ่อนคลาย: วอร์มอัพสมองสั้นๆ 5 นาที',
    'onboarding.s1Hint10': '⭐ แนะนำ: พอดีสำหรับ 1 ความท้าทายประจำวัน',
    'onboarding.s1Hint15': '🧠 บริหารสมอง: 2 ปริศนา + จดจ่อลึกซึ้งยิ่งขึ้น',
    'onboarding.s1Hint20': '👑 ระดับมาสเตอร์: ฝึกความอดทนทางสติปัญญาอย่างจริงจัง',
  },
  'vi': {
    'onboarding.s0InfoGentle': 'Bạn sẽ bắt đầu với các câu đố nhẹ nhàng',
    'onboarding.s0InfoBalanced': 'Bạn sẽ bắt đầu với các câu đố cân bằng',
    'onboarding.s0InfoChallenging': 'Bạn sẽ bắt đầu với các câu đố đầy thử thách',
    'onboarding.s0InfoGentleDesc': 'Hoàn hảo để làm quen với quy tắc và xây dựng sự tự tin.',
    'onboarding.s0InfoBalancedDesc': 'Sự kết hợp hài hòa giữa tập trung, logic và tiến bộ.',
    'onboarding.s0InfoChallengingDesc': 'Được thiết kế để thử thách logic và trau dồi kỹ năng nâng cao.',
    'onboarding.s0InfoAssist': 'Hỗ trợ thông minh sẽ tự điều chỉnh theo trình độ của bạn.',
    'onboarding.s1Hint5': '🌱 Thư giãn: 5 phút khởi động não bộ nhanh',
    'onboarding.s1Hint10': '⭐ Khuyên dùng: Hoàn hảo cho 1 Thử thách Hàng ngày',
    'onboarding.s1Hint15': '🧠 Rèn luyện trí não: 2 câu đố + tập trung sâu hơn',
    'onboarding.s1Hint20': '👑 Cấp độ Bậc thầy: Thử thách sức bền tư duy thực thụ',
  },
  'pl': {
    'onboarding.s0InfoGentle': 'Zaczniesz od łagodnych łamigłówek',
    'onboarding.s0InfoBalanced': 'Zaczniesz od zrównoważonych łamigłówek',
    'onboarding.s0InfoChallenging': 'Zaczniesz od wymagających łamigłówek',
    'onboarding.s0InfoGentleDesc': 'Idealne do nauki zasad i budowania pewności siebie.',
    'onboarding.s0InfoBalancedDesc': 'Świetne połączenie skupienia, logiki i satysfakcjonujących postępów.',
    'onboarding.s0InfoChallengingDesc': 'Stworzone, aby rozwijać logiczne myślenie i doskonalić zaawansowane techniki.',
    'onboarding.s0InfoAssist': 'Inteligentne wsparcie dostosuje się do Twoich rosnących umiejętności.',
    'onboarding.s1Hint5': '🌱 Swobodnie: Szybka 5-minutowa rozgrzewka umysłu',
    'onboarding.s1Hint10': '⭐ Rekomendowane: Idealne na 1 Wyzwanie Dnia',
    'onboarding.s1Hint15': '🧠 Trening Mózgu: 2 łamigłówki + głębsze skupienie',
    'onboarding.s1Hint20': '👑 Poziom Mistrzowski: Poważny test wytrzymałości umysłowej',
  },
  'zh-TW': {
    'onboarding.s0InfoGentle': '您將從溫和謎題開始',
    'onboarding.s0InfoBalanced': '您將從適中謎題開始',
    'onboarding.s0InfoChallenging': '您將從高難謎題開始',
    'onboarding.s0InfoGentleDesc': '適合熟悉規則並建立自信。',
    'onboarding.s0InfoBalancedDesc': '專注與邏輯的完美融合，穩步提升。',
    'onboarding.s0InfoChallengingDesc': '挑戰邏輯極限，磨練高階技巧。',
    'onboarding.s0InfoAssist': '智慧輔助會隨著技巧提升自動調節。',
    'onboarding.s1Hint5': '🌱 休閒：5分鐘快速大腦熱身',
    'onboarding.s1Hint10': '⭐ 推薦：正好完成1個每日挑戰',
    'onboarding.s1Hint15': '🧠 健腦：2道謎題 + 深度沉浸',
    'onboarding.s1Hint20': '👑 大師：高強度認知耐力鍛鍊',
  },
  'nl': {
    'onboarding.s0InfoGentle': 'Je begint met rustige puzzels',
    'onboarding.s0InfoBalanced': 'Je begint met gebalanceerde puzzels',
    'onboarding.s0InfoChallenging': 'Je begint met uitdagende puzzels',
    'onboarding.s0InfoGentleDesc': 'Ideaal om de regels te leren en zelfvertrouwen op te bouwen.',
    'onboarding.s0InfoBalancedDesc': 'Een fijne combinatie van focus, logica en voldoening.',
    'onboarding.s0InfoChallengingDesc': 'Ontworpen om je logica te testen en geavanceerde technieken te leren.',
    'onboarding.s0InfoAssist': 'Slimme hulpmiddelen passen zich aan jouw vaardigheden aan.',
    'onboarding.s1Hint5': '🌱 Ontspannen: Snelle brein-opwarming van 5 minuten',
    'onboarding.s1Hint10': '⭐ Aanbevolen: Perfect voor 1 Dagelijkse Uitdaging',
    'onboarding.s1Hint15': '🧠 Breintraining: 2 puzzels + diepere focus',
    'onboarding.s1Hint20': '👑 Meesterniveau: Serieuze mentale uithoudingsvermogen',
  },
  'sv': {
    'onboarding.s0InfoGentle': 'Du börjar med skonsamma pussel',
    'onboarding.s0InfoBalanced': 'Du börjar med balanserade pussel',
    'onboarding.s0InfoChallenging': 'Du börjar med utmanande pussel',
    'onboarding.s0InfoGentleDesc': 'Perfekt för att lära sig reglerna och bygga självförtroende.',
    'onboarding.s0InfoBalancedDesc': 'En fin mix av fokus, logik och tillfredsställande framsteg.',
    'onboarding.s0InfoChallengingDesc': 'Skapat för att utmana ditt tänkande och slipa avancerade färdigheter.',
    'onboarding.s0InfoAssist': 'Smarta hjälpmedel anpassas automatiskt efter dina färdigheter.',
    'onboarding.s1Hint5': '🌱 Avslappnat: Snabb 5-minuters hjärnuppvärmning',
    'onboarding.s1Hint10': '⭐ Rekommenderas: Perfekt för 1 Daglig Utmaning',
    'onboarding.s1Hint15': '🧠 Hjärnträning: 2 pussel + djupare fokus',
    'onboarding.s1Hint20': '👑 Mästarnivå: Seriös kognitiv uthållighetsträning',
  }
};

let content = fs.readFileSync(translationsPath, 'utf8');

// 1. Add keys to Translations interface
const typeEndIdx = content.indexOf('export type TranslationKey = keyof Translations;');
if (typeEndIdx === -1) {
  console.error('Could not find TranslationKey definition');
  process.exit(1);
}

const beforeType = content.substring(0, typeEndIdx);
const afterType = content.substring(typeEndIdx);

const lastBrace = beforeType.lastIndexOf('}');
const newInterfaceEntries = newKeys.map(k => `  ${k}\n`).join('');
content = beforeType.substring(0, lastBrace) + newInterfaceEntries + beforeType.substring(lastBrace) + afterType;

// 2. Add keys to each language map in TRANSLATIONS
for (const [lang, translations] of Object.entries(dataByLang)) {
  const langKey = `'${lang}': {`;
  const langIdx = content.indexOf(langKey);
  if (langIdx === -1) {
    console.warn(`Language ${lang} not found in TRANSLATIONS!`);
    continue;
  }

  // Find closing brace of this language block
  // We can find the next lang or the end
  const nextLangKeyMatch = content.substring(langIdx + langKey.length).search(/\n\s*\},?\n\s*(\/\/[^\n]*\n\s*)?'[a-zA-Z-]+': \{|\n\s*\};\s*$/);
  if (nextLangKeyMatch === -1) {
    console.warn(`End of block for ${lang} not found!`);
    continue;
  }
  
  const insertPos = langIdx + langKey.length + nextLangKeyMatch;
  const linesToInsert = Object.entries(translations)
    .map(([k, v]) => `    '${k}': '${v.replace(/'/g, "\\'")}',\n`)
    .join('');

  content = content.substring(0, insertPos) + linesToInsert + content.substring(insertPos);
}

fs.writeFileSync(translationsPath, content, 'utf8');
console.log('Successfully added onboarding hints and info keys across all 20 languages!');
