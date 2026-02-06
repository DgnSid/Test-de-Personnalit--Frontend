// Tableau des 72 questions NYOTA
const NYOTA_QUESTIONS = [
    // Bloc 1: Big Five (Questions 1-30)
    {
        id: 1,
        text: "J’aime explorer des idées nouvelles.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 2,
        text: "Je m’ennuie vite quand les choses sont trop prévisibles.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 3,
        text: "J’aime apprendre des sujets complexes.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 4,
        text: "Je remets facilement en question les méthodes existantes.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 5,
        text: "Je suis curieux(se) intellectuellement.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 6,
        text: "J’apprécie les situations qui me sortent de ma routine.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 7,
        text: "Je respecte les délais même sous pression.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 8,
        text: "Je termine ce que je commence.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 9,
        text: "Je suis organisé(e) dans mon travail.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 10,
        text: "Je fais attention aux détails.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 11,
        text: "Je planifie avant d'agir.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 12,
        text: "On peut compter sur moi.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 13,
        text: "Je me sens à l'aise pour prendre la parole.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 14,
        text: "J'aime interagir avec des personnes nouvelles.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 15,
        text: "J'ai de l'énergie dans les environnements dynamiques.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 16,
        text: "Je suis à l'aise pour influencer ou convaincre.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 17,
        text: "J'aime être visible dans un groupe.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 18,
        text: "Je prends naturellement de la place dans les échanges.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 19,
        text: "Je fais facilement confiance aux autres.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 20,
        text: "Je cherche des solutions gagnant-gagnant.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 21,
        text: "J'essaie d'éviter les conflits inutiles.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 22,
        text: "Je fais preuve d'empathie au travail.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 23,
        text: "Je coopère facilement en équipe.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 24,
        text: "Je prends en compte les besoins des autres.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 25,
        text: "Je garde mon calme dans les situations tendues.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 26,
        text: "Je gère bien le stress.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 27,
        text: "Je prends du recul face aux difficultés.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 28,
        text: "Je récupère vite après un échec.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 29,
        text: "Je ne me laisse pas facilement déstabiliser.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    {
        id: 30,
        text: "Je reste rationnel(le) sous pression.",
        bloc: "Bloc 1 - Traits de personnalité"
    },
    // Bloc 2: Hogan-inspired (Questions 31-46)
    {
        id: 31,
        text: "Sous pression, j'ai tendance à vouloir tout contrôler.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 32,
        text: "Quand la situation se dégrade, je deviens plus rigide.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 33,
        text: "Le stress peut me rendre impatient(e) ou irritable.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 34,
        text: "En contexte tendu, je délègue moins.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 35,
        text: "Je peux me montrer excessivement exigeant(e) sous pression.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 36,
        text: "Face à l'incertitude, je deviens méfiant(e).",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 37,
        text: "Il m'arrive d'éviter les sujets difficiles quand la tension monte.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 38,
        text: "Sous stress, je m'accroche fortement à mes positions.",
        bloc: "Bloc 2 - Comportements sous stress"
    },
    {
        id: 39,
        text: "J'ai besoin de me sentir utile dans mon travail.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 40,
        text: "La reconnaissance est importante pour moi.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 41,
        text: "J'aime avoir de l'autonomie dans mes décisions.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 42,
        text: "Les défis ambitieux me motivent.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 43,
        text: "La stabilité et la sécurité comptent beaucoup pour moi.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 44,
        text: "J'aime apprendre en continu.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 45,
        text: "Avoir de l'influence est important pour moi.",
        bloc: "Bloc 2 - Motivations"
    },
    {
        id: 46,
        text: "L'impact de mon travail sur les autres me motive.",
        bloc: "Bloc 2 - Motivations"
    },
    // Bloc 3: PI-inspired (Questions 47-58)
    {
        id: 47,
        text: "Je prends spontanément des initiatives.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 48,
        text: "Je préfère avancer vite plutôt que viser la perfection.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 49,
        text: "Je suis à l'aise sans cadre très structuré.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 50,
        text: "J'aime décider rapidement.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 51,
        text: "Je me motive facilement seul(e).",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 52,
        text: "Je tolère bien l'imprévu.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 53,
        text: "Mon rôle actuel me demande plus de structure que je n'en aurais besoin naturellement.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 54,
        text: "Je dois contrôler mon impulsivité dans mon travail.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 55,
        text: "Je fournis un effort conscient pour m'adapter à mon environnement.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 56,
        text: "Je dois ralentir mon rythme naturel pour être efficace.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 57,
        text: "Je travaille avec des règles qui ne sont pas spontanées pour moi.",
        bloc: "Bloc 3 - Style de travail"
    },
    {
        id: 58,
        text: "Mon poste exige une forte conformité aux procédures.",
        bloc: "Bloc 3 - Style de travail"
    },
    // Bloc 4: Recherche innovante (Questions 59-72)
    {
        id: 59,
        text: "Je sais clairement ce qui est important pour moi professionnellement.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 60,
        text: "J'ai une vision cohérente de qui je suis au travail.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 61,
        text: "Mon comportement change beaucoup selon le contexte.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 62,
        text: "Je sais expliquer mes choix professionnels sans hésitation.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 63,
        text: "Je me reconnais dans mes décisions passées.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 64,
        text: "Je prends des initiatives après avoir évalué les conséquences.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 65,
        text: "Il m'arrive volontairement de ne pas agir quand le timing n'est pas bon.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 66,
        text: "J'anticipe les problèmes avant qu'ils ne deviennent visibles.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 67,
        text: "J'adapte mon niveau d'initiative au contexte.",
        bloc: "Bloc 4 - Alignement"
    },
    {
        id: 68,
        text: "Je distingue action utile et agitation inutile.",
        bloc: "Bloc 4 - Discernement"
    },
    {
        id: 69,
        text: "J'ai une idée claire de ce que je veux devenir professionnellement.",
        bloc: "Bloc 4 - Discernement"
    },
    {
        id: 70,
        text: "Mes choix actuels sont cohérents avec mon avenir souhaité.",
        bloc: "Bloc 4 - Discernement"
    },
    {
        id: 71,
        text: "Je me projette facilement à 3–5 ans.",
        bloc: "Bloc 4 - Discernement"
    },
    {
        id: 72,
        text: "J'ajuste mes décisions présentes en fonction de mes objectifs futurs.",
        bloc: "Bloc 4 - Discernement"
    }
];