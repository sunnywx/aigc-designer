import _ from "lodash"
import { ValueOf } from "next/constants";
import { fabric } from "fabric";
import { CIRCLE, LINE, RECTANGLE, TRIANGLE, TEXT } from "@/editor/config/shapes";
import {emitter} from '@/editor/ctx'
import {debounce} from 'lodash'
import { TextOptions } from "fabric/fabric-impl";

export interface CanvasOptions extends fabric.ICanvasOptions {
  fillColor?: string;
  textAlign?: string
  fontFamily?: string;
  strokeColor?: string;
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
  getSelectedType: (type: string) => void;
}

// Canvas class using fabric
export default class Canvas {
  el: HTMLCanvasElement;
  canvas: fabric.Canvas;
  ctx: CanvasRenderingContext2D | null;
  options: CanvasOptions;
  resizeObserver: ResizeObserver | null;
  lastDimension: {width: number, height: number};
  
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
    this.lastDimension={
      width: 600,
      height: 650,
    }
    // @ts-ignore
    this.options=_.defaults(this.options, options, {
      ...this.lastDimension,
      backgroundColor: '#f5f5f5',
      fillColor: '#143ab8',
      strokeColor: '#000000',
      textAlign: 'left',
      fontFamily: "arial",
      zoomStep: 0.2,
      minZoom: 0.2,
      maxZoom: 2,
    } as Partial<CanvasOptions>)
    
    this.canvas=new fabric.Canvas(this.el,
      _.pick(this.options, ['width', 'height', 'backgroundColor']))
  
    this.resizeObserver=new ResizeObserver((entries: ResizeObserverEntry[])=> {
      for(const entry of entries){
        const {width, height}=entry.contentRect
        this.lastDimension={width, height}
        emitter.emit("elementResize", {
          target: entry.target,
          ...this.lastDimension
        })
      }
    })
  }
  
  setOption(key: keyof CanvasOptions | Partial<CanvasOptions>, val?: ValueOf<CanvasOptions>) {
    if (typeof key === 'string') {
      // @ts-ignore
      this.options[key] = val;
    } else if (typeof key === 'object') {
      this.options = { ...this.options, ...key }
    }
  }
  
  observeCanvas(elements: Element[]){
    elements.forEach(elem=> {
      this.resizeObserver?.observe(elem)
    })
  }
  
  detachResizeObserver(){
    this.resizeObserver?.disconnect()
    this.resizeObserver=null
  }
  
  bindEvents(){
    const inst=this
    const canvas=this.canvas
    const {minZoom, maxZoom, width: initialWidth, height: initialHeight, getSelectedType} = this.options
    
    canvas.on('selection:cleared', function() {
      // canvas.setSelectedObject([])
      console.log('clear selection')
      getSelectedType("")
    })
    canvas.on('selection:created', function(e: any) {
      // setSelectedObject(e.selected)
      console.log('created selection')
      if (e.selected.length === 1) {
        if (e.selected[0].type === "text") {
          getSelectedType("text")
          return
        }
      }
      getSelectedType("notText")
    })
    canvas.on('selection:updated', function (e: any) {
      // setSelectedObject(e.selected)
      console.log('update selection')
      if (e.selected.length === 1) {
        if (e.selected[0].type === "text") {
          getSelectedType("text")
          return
        }
      }
      getSelectedType("notText")
    })
  
    // zoom and panning
    // see: http://fabricjs.com/fabric-intro-part-5#pan_zoom
    canvas.on('mouse:down', function (opt) {
      const evt=opt.e;
      // when enable drag mode, can't select object or group
      if(inst.canvasState.dragMode){
        // console.log('asset canvas===this: ', canvas === this)
        this.isDragging = true;
        this.selection = false;
        this.selectable=false
        canvas.discardActiveObject()
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        canvas.setCursor('grab')
      }
    })
    canvas.on('mouse:move', function (opt){
      // this bound to canvas
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
      this.selectable=true
    })
    canvas.on('mouse:wheel', function (opt){
      const delta = opt.e.deltaY;
      // const {offsetX, offsetY}=opt.e  // mouse point's offset
      const vpCenter=canvas.getVpCenter() // viewpoint's center
      const vpt=canvas.viewportTransform
      const origZoom = canvas.getZoom();
      let zoom = origZoom * (0.99 ** delta);
      if (zoom > maxZoom) zoom = maxZoom as number;
      if (zoom < minZoom) zoom = minZoom as number;
  
      if(origZoom === zoom) return;
      
      const panX=vpt[4]  // vpt transX
      const panY=vpt[5]
      // console.log('panX, panY, zoom: ', panX, panY, zoom)
      
      // solution-1: use css to scale canvas element
      // canvas.wrapperEl.style.setProperty('transform', `scale(${zoom})`)
      
      // solution-2: use fabric to calc canvas and children dimension
      // canvas.setDimensions({
      //   width:  initialWidth * zoom,
      //   height: initialHeight * zoom
      // })
      //
      // // calc objects offset/scale
      // canvas.getObjects().forEach(obj => {
      //   const { left, top, scaleX, scaleY } = obj
      //   console.log('obj before, scaleX, scaleY, zoom: ', obj.toJSON(), scaleX, scaleY, zoom)
      //   if(!('origLeft' in obj)){
      //     Object.assign(obj, {
      //       origLeft: left,
      //       origTop: top
      //     })
      //   }
      //   obj.set({
      //     scaleX: zoom,
      //     scaleY: zoom,
      //     left: obj.origLeft * zoom,
      //     top: obj.origTop * zoom
      //   })
      //   obj.setCoords()
      //   console.log('obj after: ', obj.toJSON())
      // })
      
      canvas.setViewportTransform([zoom, 0, 0, zoom, panX, panY])
      
      // based on vp center to zoom
      // canvas.zoomToPoint(vpCenter, zoom)
  
      // canvas.relativePan({x: panX, y: panY})
      
      // make wheel-zoom to center canvas around the point where cursor is
      // canvas.zoomToPoint({x: offsetX, y: offsetY}, zoom)
  
      emitter.emit('zoomChange', zoom)
  
      opt.e.preventDefault();
      opt.e.stopPropagation();
      
      // canvas.requestRenderAll()
      // canvas.calcOffset()
    })
  }

  addText(text: string, option: TextOptions={}) {
    // use stroke in text fill, fill default is most of the time transparent
    const object = new fabric.Textbox(text, {
      ...TEXT, 
      fill: this.options.strokeColor,
      ...option
    })
    object.set({ text: text })
    this.canvas.centerObject(object).add(object)
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, img=> {
      console.log('load img, w/h: ', img, img.width, img.height)
      // transform img
      if(Math.max(img.width!, img.height!) > 256){
        img.scale(0.5)
      }
      this.canvas.centerObject(img)
      this.canvas.setActiveObject(img)
      this.canvas.add(img)
    }, {
      crossOrigin: "Anonymous"
    })
  }
  
  addLine() {
    const object = new fabric.Line(LINE.points, {
      ...LINE.options,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
  }

  addArrow(){
    fabric.LineArrow = fabric.util.createClass(fabric.Line, {

      type: 'lineArrow',
    
      initialize: function(element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
      },
    
      toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
      },
    
      _render: function(ctx) {
        this.callSuper('_render', ctx);
    
        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;
    
        ctx.save();
    
        var xDiff = this.x2 - this.x1;
        var yDiff = this.y2 - this.y1;
        var angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
        ctx.moveTo(10, 0);
        ctx.lineTo(-20, 15);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();
    
        ctx.restore();
      }
    });

    const object = new fabric.LineArrow(LINE.points, {
      ...LINE.options,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
    
    // TODO: drawing mode - for future feat
    // fabric.LineArrow.fromObject = function(object, callback) {
    //   callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
    // };
    
    // fabric.LineArrow.async = true;
    
    // var Arrow = (function() {
    //   function Arrow(canvas) {
    //     this.canvas = canvas;
    //     this.className = 'Arrow';
    //     this.isDrawing = false;
    //     this.bindEvents();
    //   }
    
    //   Arrow.prototype.bindEvents = function() {
    //     var inst = this;
    //     inst.canvas.on('mouse:down', function(o) {
    //       inst.onMouseDown(o);
    //     });
    //     inst.canvas.on('mouse:move', function(o) {
    //       inst.onMouseMove(o);
    //     });
    //     inst.canvas.on('mouse:up', function(o) {
    //       inst.onMouseUp(o);
    //     });
    //     inst.canvas.on('object:moving', function(o) {
    //       inst.disable();
    //     })
    //   }
    
    //   Arrow.prototype.onMouseUp = function(o) {
    //     var inst = this;
    //     inst.disable();
    //   };
    
    //   Arrow.prototype.onMouseMove = function(o) {
    //     var inst = this;
    //     if (!inst.isEnable()) {
    //       return;
    //     }
    
    //     var pointer = inst.canvas.getPointer(o.e);
    //     var activeObj = inst.canvas.getActiveObject();
    //     activeObj.set({
    //       x2: pointer.x,
    //       y2: pointer.y
    //     });
    //     activeObj.setCoords();
    //     inst.canvas.renderAll();
    //   };
    
    //   Arrow.prototype.onMouseDown = function(o) {
    //     var inst = this;
    //     inst.enable();
    //     var pointer = inst.canvas.getPointer(o.e);
    
    //     var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    //     var line = new fabric.LineArrow(points, {
    //       strokeWidth: 1,
    //       fill: '#000',
    //       stroke: '#000',
    //       originX: 'center',
    //       originY: 'center',
    //       hasBorders: false,
    //       hasControls: false
    //     });
    
    //     inst.canvas.add(line).setActiveObject(line);
    //   };
    
    //   Arrow.prototype.isEnable = function() {
    //     return this.isDrawing;
    //   }
    
    //   Arrow.prototype.enable = function() {
    //     this.isDrawing = true;
    //   }
    
    //   Arrow.prototype.disable = function() {
    //     this.isDrawing = false;
    //   }
    
    //   return Arrow;
    // }());
    
    // var arrow = new Arrow(this.canvas);
    // return arrow;
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
    const object = new fabric.Triangle({
      ...TRIANGLE,
      fill: this.options.fillColor,
      stroke: this.options.strokeColor
    })
    this.canvas.add(object)
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

  setTextAlign(alignment: string) {
    this.setOption('textAlign', alignment)
    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ textAlign: alignment })
    })
    this.canvas.requestRenderAll()
  }

  setTextFontFamily(fontFamily: string) {
    this.setOption('fontFamily', fontFamily)
    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ fontFamily: fontFamily })
    })
    this.canvas.requestRenderAll()
  }

  setTextFontSize(fontSize: string) {
    this.setOption('fontSize', fontSize)
    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ fontSize: fontSize })
    })
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
    const scale=zoom + zoomStep > maxZoom ? maxZoom : zoom + zoomStep
    const vpt=this.canvas.viewportTransform
    this.canvas.setViewportTransform([scale, 0, 0, scale, vpt[4], vpt[5]])
    // this.canvas.zoomToPoint(this.canvas.getVpCenter(), scale as number)
  }
  
  zoomOut() {
    const {minZoom, zoomStep}=this.options
    const zoom = this.canvas.getZoom()
    const scale = zoom - zoomStep < minZoom ? minZoom : zoom - zoomStep
    const vpt=this.canvas.viewportTransform
    this.canvas.setViewportTransform([scale, 0, 0, scale, vpt[4], vpt[5]])
    // this.canvas.zoomToPoint(this.canvas.getVpCenter(), scale as number)
  }
  
  zoomFit(){
    // see: http://fabricjs.com/docs/fabric.StaticCanvas.html#viewportTransform
    // transformation matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    // const vpt=this.canvas.viewportTransform
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    // this.canvas.zoomToPoint(this.canvas.getVpCenter(), 1)
  }
}