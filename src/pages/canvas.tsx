import { useEffect } from "react";

export default function Canvas() {
  useEffect(()=> {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const c=canvas.getContext('2d');
  
    // draw wrapper
    c.fillStyle='lightblue';
    c.fillRect(10, 10, 400, 400);
  
    // draw a path
    c.fillStyle = '#ccddff';
    c.beginPath();
    c.moveTo(50,20);
    c.lineTo(200,50);
    c.lineTo(150,80);
    c.closePath();
    c.fill();
    c.strokeStyle = 'rgb(0,128,0)';
    c.lineWidth = 10;
    c.stroke();
  })
  
  return (
    <canvas id="canvas"></canvas>
  );
}
