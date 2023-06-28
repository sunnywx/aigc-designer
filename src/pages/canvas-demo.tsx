import { useEffect } from "react";
import {fabric} from 'fabric'

export default function CanvasDemo() {
  useEffect(()=> {
    // create HTML canvas
    const htmlCanvas = document.createElement('canvas');
    document.body.appendChild(htmlCanvas);
    const margin = 10;
    const border = 2;
    document.body.style.margin = `${margin}px ${margin}px ${margin}px ${margin}px`;
    htmlCanvas.width = window.innerWidth - 2 * (margin + border);
    htmlCanvas.height = window.innerHeight - 2 * (margin + border);
    htmlCanvas.style.border = `${border}px solid #aaa`;

// create Fabric canvas
    const canvas = new fabric.Canvas(htmlCanvas);
    canvas.on('mouse:wheel', onMouseWheel);
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
    
    canvas.backgroundColor='#eee'
    
    const rect=new fabric.Rect({
      // left: 100,
      // top: 100,
      fill: '#ff0',
      stroke: '#333',
      width: 100,
      height: 100,
      angle: 0
    })
    
    let isDragging = false;
    let lastPosX;
    let lastPosY;
    let img;
    let zoomStartScale;
  
    // fabric.Image.fromURL('/images/pic01.jpeg', (_img) => {
    //   img = _img;
    //   // img.selectable = false;
    //   canvas.add(img);
    //
    //   // initialize zoom
    //   const widthRatio = canvas.width / img.width;
    //   const heightRatio = canvas.height / img.height;
    //   const zoom = Math.min(widthRatio, heightRatio);
    //   console.log('zoom level: ', zoom)
    //   canvas.setZoom(zoom);
    //
    //   // initialize position
    //   const scaledImageWidth = img.width * zoom;
    //   const scaledImageHeight = img.height * zoom;
    //   const dx = (canvas.width - scaledImageWidth) / 2;
    //   const dy = (canvas.height - scaledImageHeight) / 2;
    //   const T = canvas.viewportTransform;
    //   T[4] += dx;
    //   T[5] += dy;
    //
    //   // const {x, y}=canvas.getVpCenter()
    //   // rect.left = x
    //   // rect.top=y
    //   // canvas.add(rect)
    //   //
    //   // canvas.requestRenderAll();
    // })
  
    const {x, y}=canvas.getVpCenter()
    rect.left = x
    rect.top=y
    canvas.add(rect)
  
    canvas.requestRenderAll();
    
    function onMouseWheel(opt) {
      const {
        e
      } = opt;
      zoomDelta(canvas, e.deltaY, e.offsetX, e.offsetY);
      // enclose(canvas, img);
      enclose(canvas, rect)
      e.preventDefault();
      e.stopPropagation();
    }
  
    function zoomDelta(canvas, delta, x, y, maxZoom = 10, minZoom = 0.1) {
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      zoom = Math.min(zoom, maxZoom);
      zoom = Math.max(zoom, minZoom);
      const point = {
        x,
        y
      };
      canvas.zoomToPoint(point, zoom);
    }
  
    function enclose(canvas, object) {
      const {
        br: brRaw,
        tl: tlRaw
      } = object.aCoords;
      const T = canvas.viewportTransform;
      const br = fabric.util.transformPoint(brRaw, T);
      const tl = fabric.util.transformPoint(tlRaw, T);
      const {
        x: left,
        y: top
      } = tl;
      const {
        x: right,
        y: bottom
      } = br;
      const {
        width,
        height
      } = canvas;
      // calculate how far to translate to line up the edge of the object with
      // the edge of the canvas
      const dLeft = Math.abs(right - width);
      const dRight = Math.abs(left);
      const dUp = Math.abs(bottom - height);
      const dDown = Math.abs(top);
      // if the object is larger than the canvas, clamp translation such that
      // we don't push the opposite boundary past the edge
      const maxDx = Math.min(dLeft, dRight);
      const maxDy = Math.min(dUp, dDown);
      const leftIsOver = left < 0;
      const rightIsOver = right > width;
      const topIsOver = top < 0;
      const bottomIsOver = bottom > height;
      const translateLeft = rightIsOver && !leftIsOver;
      const translateRight = leftIsOver && !rightIsOver;
      const translateUp = bottomIsOver && !topIsOver;
      const translateDown = topIsOver && !bottomIsOver;
      const dx = translateLeft ? -maxDx : translateRight ? maxDx : 0;
      const dy = translateUp ? -maxDy : translateDown ? maxDy : 0;
      if (dx || dy) {
        T[4] += dx;
        T[5] += dy;
        canvas.requestRenderAll();
      }
    }
  
    function getClientPosition(e) {
      const positionSource = e.touches ? e.touches[0] : e;
      const {
        clientX,
        clientY
      } = positionSource;
      return {
        clientX,
        clientY
      };
    }
  
    function onMouseDown(opt) {
      const {
        e
      } = opt;
      isDragging = true;
      const {
        clientX,
        clientY
      } = getClientPosition(e);
      lastPosX = clientX;
      lastPosY = clientY;
      canvas.selection = false;
      canvas.discardActiveObject();
    }
  
    function onMouseMove(opt) {
      if (!isDragging) {
        return;
      }
      const {
        e
      } = opt;
      const T = canvas.viewportTransform;
      const {
        clientX,
        clientY
      } = getClientPosition(e);
      T[4] += clientX - lastPosX;
      T[5] += clientY - lastPosY;
      canvas.requestRenderAll();
      lastPosX = clientX;
      lastPosY = clientY;
      // enclose(canvas, img);
      enclose(canvas, rect)
    }
  
    function onMouseUp(opt) {
      const {
        x,
        y
      } = opt.absolutePointer;
      canvas.setViewportTransform(canvas.viewportTransform);
      isDragging = false;
      canvas.selection = true;
    }
  }, [])
  
  return (
    <div></div>
  );
}
