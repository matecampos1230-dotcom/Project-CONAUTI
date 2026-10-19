/* Configuración y textos constantes */
(function () {
  const C = (window.CONAUTI = window.CONAUTI || {});
  C.screens = {};
  C.CFG = {
    TIP_MS: 15000, FIRST_BLOCK: 3, MORE_BLOCK: 2, MIN_DETAIL: 20, MAX_PROJECTS: 3, INTERVIEW_SECONDS: 120, MIN_ANSWER_WORDS: 10,
    DRAFT_KEY: 'conauti:draft:v1',
    LIMITS: { puesto: 80, institucion: 100, carrera: 80, periodo: 30, titulo: 90, detalle: 600, respuesta: 1500 }
  };
  C.SIT = { estudiante: 'Estudiante', egresado: 'Recién egresado', practicas: 'Candidato a prácticas' };
  C.EXAMPLES = [
    { titulo: 'Sistema de reservas para la biblioteca', detalle: 'Lideré un equipo de 4 personas. Diseñé la base de datos y programé el módulo de reservas. Lo usaron 120 estudiantes durante el piloto.' },
    { titulo: 'Campaña de redes para un club universitario', detalle: 'Organicé la difusión de un club de 60 miembros. Creé el calendario de contenidos y diseñé las piezas en Canva. Aumentamos los seguidores en 40% en dos meses.' },
    { titulo: 'Análisis de ventas de una bodega', detalle: 'Analicé las ventas de un negocio local con Excel. Armé un tablero con los productos más rentables. El dueño ajustó su inventario y redujo mermas en 15%.' },
    { titulo: 'Prototipo de riego automático', detalle: 'Coordiné un prototipo con Arduino para un curso. Programé los sensores de humedad y redacté el informe técnico. Ganamos el primer puesto entre 12 equipos.' },
    { titulo: 'Talleres de refuerzo escolar', detalle: 'Dicté talleres de matemática a 25 escolares como voluntario. Preparé las clases semanales y medí su avance con prácticas cortas. El 80% mejoró su nota al cierre del ciclo.' },
    { titulo: 'Encuesta para mi trabajo de investigación', detalle: 'Realicé una encuesta a 150 estudiantes. Tabulé los resultados en Excel y presenté las conclusiones ante el jurado. Obtuve la nota máxima del curso.' }
  ];
  C.TIPS = [
    'No te preocupes por redactar perfecto. Escribe como se lo contarías a un amigo y, en el siguiente paso, lo convertiremos en viñetas profesionales.',
    'Empieza con un verbo en primera persona: “organicé”, “diseñé”, “coordiné”. Muestran que tú hiciste algo.',
    'Si puedes, añade un número: personas, horas o porcentajes. Un dato concreto pesa más que un adjetivo.',
    'Un trabajo grupal también cuenta. Lo importante es explicar cuál fue tu parte.',
    'No hace falta que sea un gran proyecto: un curso, un voluntariado o una feria ya es experiencia.',
    'Menciona las herramientas que usaste, como Excel, Canva o Python. Los reclutadores buscan esas palabras.',
    'Si no recuerdas el resultado exacto, escribe una estimación honesta: “unas 30 personas”.',
    'Tres frases bastan: qué hiciste, cómo lo hiciste y qué lograste.'
  ];
  /* La primera es fija (así empiezan las entrevistas reales); el resto se mezcla */
  C.QS = [
    ['Preséntate', 'Háblame de ti: ¿quién eres, qué estudias y por qué te interesa este puesto?'],
    ['Trabajo en equipo', 'Cuéntame de un proyecto en equipo donde hubo un desacuerdo. ¿Cómo lo resolviste?'],
    ['Resolución de problemas', 'Describe un problema difícil que enfrentaste en un proyecto y cómo lo superaste.'],
    ['Aprendizaje', 'Háblame de algo nuevo que tuviste que aprender rápido para cumplir una entrega.'],
    ['Motivación', '¿Qué te motiva a empezar tu carrera profesional y qué puedes aportar aunque sea tu primer empleo?'],
    ['Liderazgo', 'Cuéntame de una ocasión en la que tomaste la iniciativa o guiaste a otras personas.'],
    ['Gestión del tiempo', '¿Cómo organizaste tu tiempo cuando tuviste varias entregas a la vez?'],
    ['Comunicación', 'Describe una situación en la que explicaste algo complejo a alguien que no conocía el tema.'],
    ['Adaptabilidad', 'Cuéntame de un cambio inesperado en un proyecto y cómo reaccionaste.'],
    ['Aprender del error', 'Háblame de un error que cometiste en un proyecto y qué aprendiste de él.'],
    ['Bajo presión', '¿Cómo manejas la presión cuando se acerca una fecha límite y algo sale mal?'],
    ['Fortalezas y mejoras', '¿Cuál es tu mayor fortaleza y qué aspecto estás trabajando para mejorar?'],
    ['Proyección', '¿Dónde te gustaría estar profesionalmente en tres años y cómo te ayudaría este puesto?']
  ];
})();
