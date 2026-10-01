import { Instrument_Serif } from 'next/font/google'
import s from './page.module.scss'
import Signature from './signature/Signature'
import CanvasBackground from './stars/LazyBackground'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

export default function Home() {
  return (
    <>
      <CanvasBackground />
      <main className={`${s.container} ${instrumentSerif.variable}`}>
        <h1>Tomas Reimers</h1>
        <h2>About</h2>
        <p>I lead Origin at SpaceXAI (our GitHub competitor). Previously I co-founded <a href="https://graphite.com">Graphite</a> (acq&apos;d by Cursor), and before that I was a software developer at <span className={s.emphasize}>Facebook NY</span>.</p>
        <h2>Backstory</h2>
        <p>
          I started programming to make video games: When I was 10 or so my parents told me I couldn&apos;t get the video games I wanted, and—in a move that probably tells you more about me than anything else—I decided I would learn to build my own.
        </p>
        <h2>Links</h2>
        <p>
          <a href="https://blog.tomasreimers.com">Blog</a>, <a href="https://twitter.com/tomasreimers">Twitter</a>, and <a href="https://www.linkedin.com/in/tomasreimers">LinkedIn</a>.
        </p>
        <Signature />
      </main>
    </>
  )
}
