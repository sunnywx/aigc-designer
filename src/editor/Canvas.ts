import _ from "lodash"
import { ValueOf } from "next/constants";
import { fabric } from "fabric";
import { CIRCLE, LINE, RECTANGLE, TEXT } from "@/editor/config/shapes";

export interface CanvasOptions extends fabric.ICanvasOptions {
  // width?: number | string;
  // height?: number | string;
  // backgroundColor?: string;
  fillColor?: string;
  strokeColor?: string;
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
}

// Canvas class using fabric
export default class Canvas {
  el: HTMLCanvasElement;
  canvas: fabric.Canvas;
  ctx: CanvasRenderingContext2D;
  options: CanvasOptions;
  
  constructor(el: string | HTMLCanvasElement, options={}) {
    if (typeof el === 'string') {
      let canElem = document.getElementById(el)
      if (!canElem) {
        // create canvas element dynamically
        canElem = document.createElement('canvas')
        canElem.setAttribute('id', el);
        document.body.appendChild(canElem)
      }
      this.el=canElem as HTMLCanvasElement;
    } else if (el instanceof HTMLCanvasElement) {
      this.el = el
    } else {
      throw Error('Unable to initialize canvas element')
    }
    this.ctx = this.el.getContext('2d')
    this.options=_.defaults(this.options, options, {
      width: 600,
      height: 650,
      backgroundColor: '#f5f5f5',
      fillColor: 'rgba(255, 255, 255, 0.0)',
      strokeColor: '#000',
      zoomStep: 0.2,
      minZoom: 0.2,
      maxZoom: 2.6
    } as Partial<CanvasOptions>)
    
    this.canvas=new fabric.Canvas(this.el,
      _.pick(this.options, ['width', 'height', 'backgroundColor']))
  }
  
  setOption(key: keyof CanvasOptions | Partial<CanvasOptions>, val?: ValueOf<CanvasOptions>) {
    if (typeof key === 'string') {
      this.options[key] = val;
    } else if (typeof key === 'object') {
      this.options = { ...this.options, ...key }
    }
  }
  
  bindEvents(){
    const canvas=this.canvas
    const {minZoom, maxZoom}=this.options
    
    // canvas.on('selection:cleared', function() {
    //   console.log('clear selection')
    // })
    // canvas.on('selection:created', function(e: any) {
    //   console.log('created selection')
    // })
    // canvas.on('selection:updated', function (e: any) {
    //   console.log('update selection')
    // })
  
    // zoom and panning
    // see: http://fabricjs.com/fabric-intro-part-5#pan_zoom
    canvas.on('mouse:down', function (opt) {
      const evt=opt.e;
      if(evt.altKey){
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        // todo: change mouse style to move status
      }
    })
    canvas.on('mouse:move', function (opt){
      if(this.isDragging){
        const {e}=opt
        const vpt = this.viewportTransform;
        if (vpt) {vpt[4] += e.clientX - this.lastPosX;}
        if (vpt) {vpt[5] += e.clientY - this.lastPosY;}
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    })
    canvas.on('mouse:up', function (opt){
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    })
    canvas.on('mouse:wheel', function (opt){
      const delta = opt.e.deltaY;
      // const {offsetX, offsetY}=opt.e  // mouse point's offset
      const vpCenter=canvas.getVpCenter() // viewpoint's center
      let zoom = canvas.getZoom();
      zoom *= 0.99 ** delta;
      if (zoom > maxZoom) zoom = maxZoom as number;
      if (zoom < minZoom) zoom = minZoom as number;
      // make wheel-zoom to center canvas around the point where cursor is
      // canvas.zoomToPoint({x: offsetX, y: offsetY}, zoom)
      
      // always based on vp center to zoom
      canvas.zoomToPoint(vpCenter, zoom)
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })
  }

  addText(text: string) {
    // use stroke in text fill, fill default is most of the time transparent
    const object = new fabric.Textbox(text, { 
      ...TEXT, 
      fill: this.options.strokeColor
    })
    object.set({ text: text })
    this.canvas.add(object)
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, img=> {
      // console.log('load img: ', img)
      // transform img
      if(img.width > 256){
        img.scale(0.5)
      }
      this.canvas.centerObject(img)
      this.canvas.setActiveObject(img)
      this.canvas.add(img)
    })
  }
  
  addLine() {
    const object = new fabric.Line(LINE.points, {
      ...LINE.options,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
  }
  
  addCircle(){
    const object = new fabric.Circle({
      ...CIRCLE,
      fill: this.options.fillColor,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
  }
  
  addRectangle(){
    const object = new fabric.Rect({
      ...RECTANGLE,
      fill: this.options.fillColor,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
  }
  
  addTriangle(){
  
  }
  
  addArrow(){
  
  }
  
  addProperty(propertyId: string){
  
  }
  
  addIcon(iconName: string){
  
  }
  
  addLogo(logoName: string){
  
  }
  
  deleteAll() {
    this.canvas.getObjects().forEach((object) => this.canvas.remove(object))
    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
  }
  
  deleteSelected() {
    this.canvas.getActiveObjects().forEach((object) => this.canvas.remove(object))
    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
  }
  
  setFillColor(fill: string) {
    this.setOption('fillColor', fill)
    this.canvas.getActiveObjects().forEach((object) => object.set({ fill }))
    this.canvas.requestRenderAll()
  }
  
  setStrokeColor(stroke: string) {
    this.setOption('strokeColor', stroke)
    this.canvas.getActiveObjects().forEach((object) => {
      if (object.type === TEXT.type) {
        // use stroke in text fill
        object.set({ fill: stroke })
        return
      }
      object.set({ stroke })
    })
    this.canvas.requestRenderAll()
  }
  
  zoomIn(){
    const {maxZoom, zoomStep}=this.options
    const zoom = this.canvas.getZoom()
    const toScale=zoom + zoomStep > maxZoom ? maxZoom : zoom + zoomStep
    // const center=this.canvas.getCenterPoint()
    // const vpCenter=this.canvas.getVpCenter()
    // console.log('center, vp-center, zoom: ', center, vpCenter, this.canvas.getZoom())
    // console.log('vpCoords, vpt: ', this.canvas.vptCoords, this.canvas.viewportTransform)
    this.canvas.zoomToPoint(this.canvas.getVpCenter(), toScale as number)
  }
  
  zoomOut() {
    const {minZoom, zoomStep}=this.options
    const zoom = this.canvas.getZoom()
    const toScale = zoom - zoomStep < minZoom ? minZoom : zoom - zoomStep
    this.canvas.zoomToPoint(this.canvas.getVpCenter(), toScale as number)
  }
  
  zoomFit(){
    // reset initial vp transform matrix
    // see: http://fabricjs.com/docs/fabric.StaticCanvas.html#viewportTransform
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  }
}