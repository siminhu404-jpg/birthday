import { useEffect, useRef } from 'react'

const COLORS = ['#a55d5d', '#dbac87', '#ffda91', '#fff0c2', '#e9a6a0']

function Fireworks({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameId
    let finished = false
    const particles = []
    const rockets = []
    const start = performance.now()

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * ratio
      canvas.height = canvas.clientHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const launch = (delay, x, color) => {
      window.setTimeout(() => {
        if (finished) return
        rockets.push({ x: canvas.clientWidth * x, y: canvas.clientHeight + 10, target: canvas.clientHeight * (0.2 + Math.random() * 0.22), color, speed: 7 + Math.random() * 2 })
      }, delay)
    }

    const burst = (rocket) => {
      const count = 78 + Math.floor(Math.random() * 24)
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count
        const speed = 1.5 + Math.random() * 3.5
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 55 + Math.random() * 28,
          color: rocket.color,
          size: 1 + Math.random() * 1.5,
        })
      }
    }

    const render = (now) => {
      const elapsed = now - start
      context.fillStyle = 'rgba(20, 15, 20, 0.22)'
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      rockets.forEach((rocket, index) => {
        rocket.y -= rocket.speed
        context.fillStyle = rocket.color
        context.fillRect(rocket.x, rocket.y, 2, 9)
        if (rocket.y <= rocket.target) {
          burst(rocket)
          rockets.splice(index, 1)
        }
      })

      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.045
        particle.life -= 1
        context.globalAlpha = Math.max(particle.life / 75, 0)
        context.fillStyle = particle.color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
        if (particle.life <= 0) particles.splice(index, 1)
      })
      context.globalAlpha = 1

      if (elapsed > 2500 && particles.length === 0 && rockets.length === 0) {
        finished = true
        onComplete?.()
        return
      }
      frameId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    launch(0, 0.28, COLORS[0])
    launch(240, 0.72, COLORS[1])
    launch(520, 0.5, COLORS[2])
    frameId = requestAnimationFrame(render)

    return () => {
      finished = true
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [onComplete])

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-label="生日烟花" />
}

export default Fireworks
