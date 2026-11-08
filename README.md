# Juegos+ — juegos para amigos y llamadas

Aplicación web de juegos sociales hecha con Next.js 16, React y TypeScript. Se juega desde un mismo dispositivo, sin cuentas y sin instalaciones.

## Juegos disponibles

- **Verdad o Reto**: más de 300 preguntas y retos, filtros de intensidad y categorías. El contenido +18 requiere activación explícita y no se conserva al recargar.
- **Yo nunca nunca**: 36 frases, con contador opcional de personas que lo hicieron.
- **¿Qué prefieres?**: 36 dilemas con contadores para votar A o B.
- **¿Quién es más probable que…?**: 36 preguntas para votar por los participantes que agregaste.

Los juegos evitan repetir preguntas mientras el mazo no se agote. Puedes mezclar las cartas de nuevo en cualquier momento.

## Modos de juego

1. En la portada elige uno de los cuatro juegos.
2. Indica si están juntos (**Presencial**) o jugando por **Llamada**.
3. Escoge el ambiente: Amigos, Parejas, Fiesta o Todos.
4. Si deseas, registra entre 2 y 12 participantes para utilizar la **ruleta animada**.
5. Saca una carta, usa los botones de votación si el juego los tiene, cambia de turno o pasa sin penalización.

**Modo llamada:** el juego contiene actividades compatibles con hablar por WhatsApp, Meet o Discord, pero **no crea llamadas ni salas sincronizadas en tiempo real**. Una persona dirige la partida y puede compartir pantalla.

## Personalización

El botón flotante **Diseño** permite elegir entre Neon Party, Party Pop, Midnight y Candy Play, incluso durante una partida. La preferencia se guarda únicamente en el navegador.

## Herramientas

- Ruleta con nombres, giro visual y selección aleatoria. Evita repetir inmediatamente al jugador actual.
- Temporizador configurable de 15, 30 o 60 segundos.
- Sin registro. Nombres, juego elegido, configuración y cartas utilizadas guardados en `localStorage`.
- Animaciones adaptadas a la configuración de movimiento reducido de tu dispositivo.

## Ejecutar

Con Node.js 22+ y pnpm 12.3.4:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Para revisar el proyecto:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

El repositorio contiene comprobaciones automáticas en GitHub Actions. En producción también se usa Vercel Analytics.
