import { motion } from 'framer-motion'

const orbs = [
  { size: 600, x: '-20%', y: '-20%', color: 'rgba(37,99,235,0.18)', duration: 18, delay: 0 },
  { size: 500, x: '65%',  y: '-10%', color: 'rgba(79,70,229,0.15)', duration: 22, delay: 3 },
  { size: 450, x: '-10%', y: '55%',  color: 'rgba(124,58,237,0.13)', duration: 20, delay: 6 },
  { size: 350, x: '70%',  y: '60%',  color: 'rgba(37,99,235,0.10)', duration: 25, delay: 9 },
]

export default function FloatingBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #1e1b4b 50%, #2e1065 100%)' }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 20, -10, 0],
            rotate: [0, 8, -5, 3, 0],
            scale: [1, 1.05, 0.97, 1.03, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
