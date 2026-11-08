export type SocialGameId = 'verdad-reto' | 'yo-nunca' | 'que-prefieres' | 'quien-probable'
export type PartyGameId = Exclude<SocialGameId, 'verdad-reto'>
export type Audience = 'amigos' | 'parejas' | 'fiesta'
export type PartyPrompt = {
  id: string
  game: PartyGameId
  text: string
  audiences: Audience[]
  optionA?: string
  optionB?: string
}

export const gameCatalog: { id: SocialGameId; title: string; short: string; description: string; emoji: string }[] = [
  { id: 'verdad-reto', title: 'Verdad o Reto', short: 'Verdad o Reto', description: 'Secretos, desafíos y carcajadas.', emoji: '🎭' },
  { id: 'yo-nunca', title: 'Yo nunca nunca', short: 'Yo nunca', description: 'Descubre historias inesperadas.', emoji: '🙈' },
  { id: 'que-prefieres', title: '¿Qué prefieres?', short: '¿Qué prefieres?', description: 'Dos opciones, una decisión imposible.', emoji: '⚖️' },
  { id: 'quien-probable', title: '¿Quién es más probable?', short: '¿Quién sería?', description: 'Voten y descubran a quién señalan.', emoji: '👀' },
]

const neverStatements = [
  'Yo nunca he enviado un mensaje a la persona equivocada.',
  'Yo nunca he fingido entender un chiste.',
  'Yo nunca me he reído en un momento serio.',
  'Yo nunca he olvidado por qué entré a una habitación.',
  'Yo nunca he cantado frente al espejo como artista famoso.',
  'Yo nunca he puesto una alarma y la he ignorado por completo.',
  'Yo nunca he fingido que no vi un mensaje.',
  'Yo nunca he visto una temporada entera de una serie en un día.',
  'Yo nunca he comido algo que se me cayó al suelo.',
  'Yo nunca he aprendido un baile para un video.',
  'Yo nunca he dicho «ya voy» sin haber salido de casa.',
  'Yo nunca he inventado una excusa para cancelar un plan.',
  'Yo nunca he olvidado el cumpleaños de alguien cercano.',
  'Yo nunca he tenido un apodo que me diera pena.',
  'Yo nunca he hablado con una mascota como si me respondiera.',
  'Yo nunca he llorado con una película animada.',
  'Yo nunca he guardado una captura de pantalla por si acaso.',
  'Yo nunca he soñado con alguien y luego me dio pena verlo.',
  'Yo nunca he practicado una conversación antes de tenerla.',
  'Yo nunca he sentido mariposas por un mensaje.',
  'Yo nunca he tenido un crush secreto.',
  'Yo nunca he escrito un mensaje romántico y luego lo borré.',
  'Yo nunca he elegido un atuendo pensando en alguien especial.',
  'Yo nunca he dedicado una canción sin decir a quién.',
  'Yo nunca he hecho una declaración romántica muy dramática.',
  'Yo nunca he dicho una mentira piadosa para dar una sorpresa.',
  'Yo nunca he confundido a dos personas por teléfono.',
  'Yo nunca he ganado un juego sin entender bien las reglas.',
  'Yo nunca he hecho un chiste tan malo que terminó dando risa.',
  'Yo nunca he inventado una palabra que mis amigos siguen usando.',
  'Yo nunca he cantado la letra equivocada durante años.',
  'Yo nunca he querido repetir una cita o salida perfecta.',
  'Yo nunca he buscado mi propio nombre en internet.',
  'Yo nunca he tenido un momento de fama entre mis amigos.',
  'Yo nunca he guardado una entrada o recuerdo de un día especial.',
  'Yo nunca he sentido nervios antes de conocer a alguien.',
]

const wouldYouRather: [string, string][] = [
  ['Viajar al pasado por un día', 'Viajar al futuro por un día'],
  ['Tener vacaciones en la playa', 'Tener vacaciones en la montaña'],
  ['Poder volar', 'Poder hacerte invisible'],
  ['No volver a usar redes sociales', 'No volver a ver series'],
  ['Cenar con tu artista favorito', 'Actuar en tu película favorita'],
  ['Hablar todos los idiomas', 'Tocar todos los instrumentos'],
  ['Ser muy bueno cocinando', 'Ser muy bueno bailando'],
  ['Salir de viaje sin planear nada', 'Organizar hasta el último detalle'],
  ['Vivir sin música durante un mes', 'Vivir sin videojuegos durante un mes'],
  ['Poder teletransportarte', 'Poder detener el tiempo cinco segundos'],
  ['Tener un millón de seguidores', 'Tener diez amigos inseparables'],
  ['Vivir en una película de comedia', 'Vivir en una película de aventura'],
  ['Tener una fiesta sorpresa', 'Organizar tu propia fiesta'],
  ['Saber qué piensan los gatos', 'Poder conversar con los perros'],
  ['Tener una memoria perfecta', 'Aprender cualquier habilidad en un día'],
  ['Una cita en un café tranquilo', 'Una cita en un parque de diversiones'],
  ['Un regalo hecho a mano', 'Una experiencia inolvidable'],
  ['Una serenata romántica', 'Una carta de amor'],
  ['Ver el amanecer juntos', 'Ver las estrellas juntos'],
  ['Tener una cita espontánea', 'Tener una cita cuidadosamente planeada'],
  ['Una escapada de fin de semana', 'Una cena especial en casa'],
  ['Ser quien cuenta los chistes', 'Ser quien siempre se ríe'],
  ['Jugar en equipos', 'Competir todos contra todos'],
  ['Cantar en público', 'Bailar frente a todos'],
  ['Hacer un viaje con amigos', 'Organizar una gran reunión en casa'],
  ['Cambiar de nombre por un día', 'Cambiar de voz por un día'],
  ['Que todos conozcan tus gustos musicales', 'Que todos conozcan tus series favoritas'],
  ['Tener siempre la mejor comida', 'Tener siempre la mejor música'],
  ['Vivir una aventura espacial', 'Explorar el fondo del mar'],
  ['Poder repetir una gran fiesta', 'Poder revivir un buen viaje'],
  ['Una semana sin internet', 'Una semana sin televisión'],
  ['Recibir un cumplido inesperado', 'Recibir una sorpresa de alguien especial'],
  ['Visitar cien países', 'Conocer a cien personas interesantes'],
  ['Tener un jardín enorme', 'Tener una biblioteca enorme'],
  ['Elegir la música de la fiesta', 'Elegir todos los juegos de la fiesta'],
  ['Conocer el final de una serie', 'Olvidarla para verla de nuevo'],
]

const mostLikely = [
  '¿Quién es más probable que llegue tarde a su propia fiesta?',
  '¿Quién es más probable que se haga famoso por accidente?',
  '¿Quién es más probable que sobreviva en una isla desierta?',
  '¿Quién es más probable que olvide dónde dejó el celular?',
  '¿Quién es más probable que se ría durante una película de terror?',
  '¿Quién es más probable que gane un concurso de baile?',
  '¿Quién es más probable que adopte cinco mascotas?',
  '¿Quién es más probable que organice un viaje sorpresa?',
  '¿Quién es más probable que se convierta en influencer?',
  '¿Quién es más probable que cuente un chiste en el peor momento?',
  '¿Quién es más probable que aprenda un idioma por diversión?',
  '¿Quién es más probable que escriba un libro?',
  '¿Quién es más probable que encuentre una oferta increíble?',
  '¿Quién es más probable que gane una discusión sobre películas?',
  '¿Quién es más probable que haga amigos en cualquier lugar?',
  '¿Quién es más probable que recuerde todos los cumpleaños?',
  '¿Quién es más probable que prepare una cita romántica muy creativa?',
  '¿Quién es más probable que se enamore de un personaje de ficción?',
  '¿Quién es más probable que dedique una canción especial?',
  '¿Quién es más probable que planee una sorpresa inolvidable?',
  '¿Quién es más probable que proponga un plan espontáneo?',
  '¿Quién es más probable que tenga una lista de reproducción para todo?',
  '¿Quién es más probable que gane un concurso de karaoke?',
  '¿Quién es más probable que llegue disfrazado a una fiesta normal?',
  '¿Quién es más probable que invente un apodo para todos?',
  '¿Quién es más probable que se vuelva protagonista de un video viral?',
  '¿Quién es más probable que cocine para todo el grupo?',
  '¿Quién es más probable que pierda en piedra, papel o tijera?',
  '¿Quién es más probable que cuente una anécdota increíble?',
  '¿Quién es más probable que encuentre el lado gracioso de cualquier situación?',
  '¿Quién es más probable que haga una gran declaración romántica?',
  '¿Quién es más probable que se emocione viendo una película?',
  '¿Quién es más probable que convierta un día común en una aventura?',
  '¿Quién es más probable que sea el DJ del grupo?',
  '¿Quién es más probable que tome las mejores fotos?',
  '¿Quién es más probable que invente un nuevo juego?',
]

// Cada tema tiene opciones amistosas, románticas y para fiestas.
// Los tres juegos se pueden jugar tanto presencialmente como por llamada.
function audiencesFor(index: number): Audience[] {
  if (index % 4 === 0) return ['amigos', 'parejas', 'fiesta']
  if (index % 4 === 1) return ['amigos', 'fiesta']
  if (index % 4 === 2) return ['parejas', 'amigos']
  return ['fiesta', 'parejas']
}

export const partyPrompts: PartyPrompt[] = [
  ...neverStatements.map((text, index) => ({ id: 'yn-' + (index + 1), game: 'yo-nunca' as const, text, audiences: audiencesFor(index) })),
  ...wouldYouRather.map(([optionA, optionB], index) => ({
    id: 'qp-' + (index + 1),
    game: 'que-prefieres' as const,
    text: '¿Qué prefieres?',
    optionA,
    optionB,
    audiences: audiencesFor(index),
  })),
  ...mostLikely.map((text, index) => ({ id: 'mp-' + (index + 1), game: 'quien-probable' as const, text, audiences: audiencesFor(index) })),
]
