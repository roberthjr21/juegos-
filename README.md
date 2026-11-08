# Verdad o Reto

Juego social de **Verdad o Reto**, creado con Next.js, TypeScript y React. Se puede usar en un solo dispositivo, sin crear cuentas.

## Cómo jugar
1. Escoge **Presencial** si están juntos o **Por llamada** si juegan por WhatsApp, Meet o Discord.
2. Elige un ambiente: Amigos, Parejas, Fiesta o Personalizado.
3. Agrega hasta 12 jugadores (opcional) y empieza.
4. Elige Verdad o Reto. Puedes pasar cualquier actividad sin penalización.

El contenido +18 está **desactivado por defecto** y debe habilitarse explícitamente por una persona adulta. Las preguntas no se repiten durante una partida, salvo que se reinicie el mazo.

### Importante sobre el modo llamada
El modo llamada selecciona actividades que se pueden realizar a distancia, pero **no inicia una videollamada ni sincroniza varios teléfonos**. Por ahora una persona dirige el juego y comparte la pantalla o lee las actividades. Las salas compartidas en tiempo real son una mejora posterior.

## Desarrollo

Se requiere Node.js 22 y pnpm 12.3.4.

```bash
pnpm install
pnpm dev
```

## Verificaciones

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Privacidad
La configuración de la partida se guarda localmente en el navegador mediante localStorage. No se requiere cuenta ni se envían nombres de participantes a un servidor del juego. Se incluye Vercel Analytics en producción.
