import { useCallback, useEffect, useRef, useState } from 'react';
import cs from 'classnames'
import {Canvas, useEditor} from '@/editor'
import Panel from '@/components/panel'
import Category from './category'
import { ElementType } from './types'
import { categories } from './config'
import TextPanel from './text-panel'
import PhotoPanel from './photo-panel'
import ShapePanel from './shape-panel'
import AIImagePanel from './ai-panel'
import PropertyPanel from './property-panel'
import TemplatePanel from './template-panel'
import IconPanel from './icon-panel'
import LogoPanel from './logo-panel'

import styles from './index.module.scss';

interface Props {
  className?: string;
  canvas?: Canvas;
}

export default function SideNav(props: Props) {
  const {panelOpen, setPanelOpen}=useEditor()
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pin, setPin] = useState(false) // panel pinned
  const [active, setActive] = useState<ElementType>('text')
  
  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);
  
  // fix canvas offset when panel open
  useEffect(()=> {
    if(!panelRef.current) return
  
    const canvasRef=document.getElementById('editor-canvas')
    const sourcePanel=document.getElementsByClassName('source-panel')[0]
    if(panelOpen){
      // calc editor canvas offsetLeft diff with source panel open offset
      const offsetLeftDiff=canvasRef.offsetLeft - (sourcePanel.clientWidth + 90)
      if(offsetLeftDiff < 0){
        // timeout with panel animation delay time
        setTimeout(()=> {
          canvasRef.style.setProperty('transform', `translateX(${Math.abs(offsetLeftDiff) + 20}px)`)
        }, 300)
      }
    } else {
      canvasRef.style.setProperty('transform', `translateX(0)`)
    }
  }, [panelOpen])
  
  function handleClickOutside(ev: any): void {
    if (!panelRef.current?.contains(ev.target) && !pin) {
      setPanelOpen?.(false)
    }
  }
  
  function renderPanelCont(): JSX.Element | null {
    if (active === 'text') {
      return <TextPanel />;
    }
    if (active === 'templates') {
      return <TemplatePanel />;
    }
    if (active === 'photo') {
      return <PhotoPanel />;
    }
    if (active === 'property') {
      return <PropertyPanel />;
    }
    if (active === 'shape') {
      return <ShapePanel />
    }
    if (active === 'icon') {
      return <IconPanel />
    }
    if (active === 'logo') {
      return <LogoPanel />
    }
    if (active === 'ai') {
      return <AIImagePanel />
    }
    return null;
  }
  
  return (
    <div ref={panelRef} style={{
      position: 'relative',
      height: 'max-content'
    }}>
      <div className={styles.nav}>
        {categories.map((gp) => {
          return (
            <Category
              {...gp}
              key={gp.type}
              active={active === gp.type}
              onClick={() => {
                setPanelOpen?.(true)
                setActive(gp.type);
              }}
            />
          );
        })}
      </div>
      <Panel
        title={categories.find(v => v.type === active)?.name || ''}
        style={{ transform: 'translateX(90px)' }}
        width='280px'
        className={cs('source-panel', styles.panel)}
        onClose={() => setPanelOpen?.(false)}
        onPin={()=> setPin(v=> !v)}
        visible={!!panelOpen}
        pinned={pin}
        closable
        pinnable={false}
      >
        {renderPanelCont()}
      </Panel>
    </div>
  );
}
