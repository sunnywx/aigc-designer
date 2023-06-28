export const STROKE = '#000000'
export const FILL = 'rgba(255, 255, 255, 0.0)'

export const CIRCLE = {
  radius: 30,
  left: 100,
  top: 100,
  fill: FILL,
  stroke: STROKE
}

export const RECTANGLE = {
  left: 100,
  top: 100,
  fill: FILL,
  stroke: STROKE,
  width: 50,
  height: 50,
  angle: 0
}

export const LINE = {
  points: [50, 100, 200, 200],
  options: {
    left: 170,
    top: 150,
    stroke: STROKE
  }
}

export const TEXT = {
  type: 'text',
  left: 100,
  top: 100,
  fontSize: 50,
  fontFamily: 'Arial',
  fill: STROKE
}
