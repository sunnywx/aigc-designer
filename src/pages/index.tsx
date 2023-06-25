import Editor from '@/editor'
import Topbar from '@/components/topbar'
import SideNav from '@/components/side-nav'
import RightPanel from '@/components/props-panel'

import styles from './editor.module.scss'

export default function EditorPage() {
  return (
    <Editor
      mainClassName={styles.main}
      canvasClassName={styles.canvas}
      renderTopbar={canvas => (
        <Topbar canvas={canvas}/>
      )}
      renderLeftPanel={canvas => {
        return (
          <SideNav canvas={canvas} />
        )
      }}
      renderRightPanel={canvas => {
        return (
          <RightPanel canvas={canvas} />
        )
      }}
    />
  )
}
