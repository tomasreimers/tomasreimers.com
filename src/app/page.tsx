import s from './page.module.scss'
import CanvasBackground from './stars/Background'

export default function Home() {
  return (
    <>
      <CanvasBackground />
      <main className={s.container}>
        <h1>Tomas Reimers</h1>
        <h2>ABOUT</h2>
        <p>I'm one of the co-founders of <a href="https://graphite.com">Graphite</a>. I used to be a software developer at <span className={s.emphasize}>Facebook NY</span>.</p>
        <h2>ORIGIN</h2>
        <p>
          I started programming to make video games: When I was 10 or so my parents told me I couldn&apos;t get the video games I wanted, and—in a move that probably tells you more about me than anything else—I decided I would learn to build my own.
        </p>
        <h2>LINKS</h2>
        <p>
          <a href="https://blog.tomasreimers.com">Blog</a>, <a href="https://twitter.com/tomasreimers">Twitter</a>, <a href="https://www.linkedin.com/in/tomasreimers">LinkedIn</a>, and <a href="https://github.com/tomasreimers">GitHub</a>.
        </p>
        {/* <Signature /> */}
      </main>
    </>
  )
}
