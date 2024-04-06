import clsx from 'clsx'
import s from './page.module.scss'
import CanvasBackground from './canvas'

export default function Home() {
  return (
    <>
      <CanvasBackground />
      <main className={s.container}>
        <div className={s.name}>
          Tomas Reimers
        </div>
        <div className={s.links}>
          <a href="https://www.linkedin.com/in/tomasreimers" className={clsx(s.link, s["link-li"])}>LinkedIn</a>
          <a href="https://github.com/tomasreimers" className={clsx(s.link, s["link-gh"])}>GitHub</a>
          <a href="https://twitter.com/tomasreimers" className={clsx(s.link, s["link-tw"])}>Twitter</a>
          {/* <div class="buttons-row">
          <a href="https://implementationdetail.com/" class="button button-id"><i class="fa fa-pencil-alt" aria-hidden="true"></i></a>
            <a href="https://stackoverflow.com/users/781199/tomas" class="button button-so"><i class="fab fa-stack-overflow" aria-hidden="true"></i></a>
          </div> */}
        </div>
      </main>
    </>
  )
}
