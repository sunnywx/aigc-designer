import _ from "lodash"
import { ValueOf } from "next/constants";
import { fabric } from "fabric";
import { CIRCLE, LINE, RECTANGLE, TRIANGLE, TEXT } from "@/editor/config/shapes";
import {emitter} from '@/editor/ctx'
import {debounce} from 'lodash'
import { TextOptions } from "fabric/fabric-impl";
import React from "react";
import ReactDOMServer from 'react-dom/server';
import { v4 as uuidv4 } from 'uuid';

export interface CanvasOptions extends fabric.ICanvasOptions {
  fontColor?: string;
  fillColor?: string;
  textAlign?: string
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  strokeColor?: string;
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
  height?: number;
  width?: number;
  getSelectedObject: (obj: any) => void;
  getCanvasObjects: (objects: any) => void;
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
    // this.lastDimension={
    //   width: 600,
    //   height: 650,
    // }
    // @ts-ignore
    this.options=_.defaults(this.options, options, {
      // ...this.lastDimension,
      backgroundColor: '#ffffff',
      fontColor: "#000000",
      fillColor: '#143ab8',
      strokeColor: '#000000',
      textAlign: 'left',
      fontFamily: TEXT.fontFamily,
      fontSize: TEXT.fontSize,
      fontWeight: 'normal',
      zoomStep: 0.2,
      minZoom: 0.2,
      maxZoom: 2,
      height: 650,
      width: 600,
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

  setBackgroundColor(color:string) {
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas))
  }
  
  setCanvasDimensions(x: number, y: number) {
    // The second argument { backstoreOnly: true } is optional and can be used to specify whether to resize only the canvas display or the canvas backstore as well. If you set it to true, only the display will be resized, while keeping the backstore dimensions intact.
    this.canvas.setDimensions({ width: x, height: y }, { backstoreOnly: true });
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
    const {minZoom, maxZoom, width, height, getCanvasObjects, getSelectedObject} = this.options
    
    canvas.on('selection:cleared', function() {
      console.log('clear selection')

      getSelectedObject(null)
      canvas.discardActiveObject()
      canvas.renderAll()
    })
    canvas.on('selection:created', function(e: any) {
      console.log('created selection: ', e.selected)
      
      // fixme
      if (e.selected.length === 1) {
        canvas.setActiveObject(e.selected[0])
        getSelectedObject(e.selected[0])
      }
    })
    canvas.on('selection:updated', function (e: any) {
      console.log('update selection: ', e.selected)
      
      if (e.selected.length === 1) {
        canvas.setActiveObject(e.selected[0])
        getSelectedObject(e.selected[0])
      }
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
      
      canvas.setViewportTransform([zoom, 0, 0, zoom, panX, panY])
      
      // based on vp center to zoom
      // canvas.zoomToPoint(vpCenter, zoom)
  
      // canvas.relativePan({x: panX, y: panY})
      
      // make wheel-zoom to center canvas around the point where cursor is
      // canvas.zoomToPoint({x: offsetX, y: offsetY}, zoom)
  
      emitter.emit('zoomChange', zoom)
  
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })
  }

  addText(text: string, option: TextOptions={}) {
    // use stroke in text fill, fill default is most of the time transparent
    const object = new fabric.Textbox(text, {
      ...TEXT, 
      fill: this.options.strokeColor,
      name: uuidv4(),
      ...option
    })
    this.options.fontFamily = option.fontFamily;
    this.options.fontSize = option.fontSize;
    this.options.fontWeight = option.fontWeight;
    object.set({ text: text })
    this.canvas.centerObject(object).add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
  }

  addImage(url: string) {
    fabric.Image.fromURL(url, img=> {
      console.log('load img, w/h: ', img, img.width, img.height)
      const ratioW=img.width / this.canvas.width
      const ratioH=img.height / this.canvas.height
      const ratio=Math.max(ratioW, ratioH)
      if(ratio > 1){
        // scale img to fit canvas
        img.scale(1 / (ratio + 2))
      }
      img.name= uuidv4(),
      img.type= "img"
      this.canvas.centerObject(img)
      this.canvas.setActiveObject(img)
      this.canvas.add(img)
      this.options.getCanvasObjects(this.canvas.getObjects())
    }, {
      // in order to export image data url
      crossOrigin: "Anonymous"
    })
  }
  
  addLine() {
    const object = new fabric.Line(LINE.points, {
      ...LINE.options,
      stroke: this.options.strokeColor,
      name: uuidv4(),
      type: "line"
    })
    this.canvas.add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
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
      stroke: this.options.strokeColor,
      name: uuidv4(),
      type: "arrow"
    })
    this.canvas.add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
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
      stroke: this.options.strokeColor,
      name: uuidv4(),
      type: "circle"
    })
    this.canvas.add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
  }
  
  addRectangle(){
    const object = new fabric.Rect({
      ...RECTANGLE,
      fill: this.options.fillColor,
      stroke: this.options.strokeColor,
      name: uuidv4(),
      type: "rectangle"
    })
    this.canvas.add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
  }
  
  addTriangle(){
    const object = new fabric.Triangle({
      ...TRIANGLE,
      fill: this.options.fillColor,
      stroke: this.options.strokeColor,
      name: uuidv4(),
      type: "triangle"
    })
    this.canvas.add(object)
    this.canvas.setActiveObject(object)
    this.options.getCanvasObjects(this.canvas.getObjects())
  }

  addIcon(iconName: string, IconComponent: any) {
    const iconElement = React.createElement(IconComponent, { size: 40 });
    const iconSVG = ReactDOMServer.renderToString(iconElement);
  
    fabric.loadSVGFromString(iconSVG, (objects, options) => {
      const iconObj = fabric.util.groupSVGElements(objects, options);
      iconObj.set({
        left: 50,
        top: 50,
        fill: this.options.fillColor,
        stroke: this.options.strokeColor,
        name: `${iconName}-${uuidv4()}`,
        type: "icon"
      });
      this.canvas.add(iconObj);
      this.canvas.setActiveObject(iconObj)
      this.options.getCanvasObjects(this.canvas.getObjects())
      this.canvas.renderAll();
    });
  }

  addProperty(propertyId: string){
  
  }
  
  addLogo(logoName: string){
  
  }
  
  deleteAll() {
    this.canvas.getObjects().forEach((object) => this.canvas.remove(object))
    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
    this.options.getCanvasObjects(this.canvas.getObjects())
  }
  
  deleteSelected() {
    this.canvas.getActiveObjects().forEach((object) => this.canvas.remove(object))
    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
    this.options.getCanvasObjects(this.canvas.getObjects())
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

  setTextFontSize(fontSize: number) {
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