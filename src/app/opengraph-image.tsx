import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'
export const alt = 'Tomas Reimers'

// Small, deterministic "starfield" for the card background
const STARS = [
  { x: 92, y: 75, r: 2 }, { x: 310, y: 140, r: 1.5 }, { x: 540, y: 60, r: 2.5 },
  { x: 760, y: 170, r: 1.5 }, { x: 1010, y: 90, r: 2 }, { x: 1130, y: 230, r: 1.5 },
  { x: 180, y: 300, r: 1.5 }, { x: 1060, y: 400, r: 2 }, { x: 420, y: 520, r: 1.5 },
  { x: 680, y: 560, r: 2 }, { x: 150, y: 540, r: 2.5 }, { x: 900, y: 500, r: 1.5 },
  { x: 60, y: 420, r: 1.5 }, { x: 1150, y: 560, r: 2 }, { x: 860, y: 40, r: 1.5 },
]

export default async function OpengraphImage() {
  const [instrumentSerif, lora] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/fonts/InstrumentSerif-Regular.ttf')),
    readFile(join(process.cwd(), 'src/app/fonts/Lora-Regular.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
        }}
      >
        {STARS.map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.r * 2,
              height: star.r * 2,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
            }}
          />
        ))}
        <div style={{ fontSize: 96, color: 'white', fontFamily: 'Instrument Serif' }}>
          Tomas Reimers
        </div>
        <div style={{ fontSize: 34, color: '#98a5bf', marginTop: 16, fontFamily: 'Lora' }}>
          Founder. Software developer.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: instrumentSerif, style: 'normal', weight: 400 },
        { name: 'Lora', data: lora, style: 'normal', weight: 400 },
      ],
    }
  )
}
