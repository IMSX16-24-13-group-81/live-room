<script lang="ts">
  import type { LineChartData } from "$lib/data/protocols"
  import { createVector } from "$lib/helpers"
  import { onMount } from "svelte"

  export let data: LineChartData
  const canvasID = Math.random().toString(16).slice(2)
  const xAxisYPos = -0.91
  const rangeVector = createVector(-1, 1, 10)

  const yValues = Array.from({ length: Math.max(...data.points.map((point) => point.y)) + 2 }, (_, i) => i + 1)

  interface CanvasPosition {
    x: number
    y: number
  }

  const co = (x: number, y: number, ctx: CanvasRenderingContext2D): CanvasPosition => {
    return {
      x: ctx.canvas.clientWidth / 2 + x * (ctx.canvas.clientWidth / 2),
      y: ctx.canvas.clientHeight / 2 - y * (ctx.canvas.clientHeight / 2),
    }
  }

  const drawXAxis = (ctx: CanvasRenderingContext2D) => {
    /*
    const start = co(-1, xAxisYPos, ctx)
    const end = co(1, xAxisYPos, ctx)
    ctx.strokeStyle = "#FFF"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    */

    rangeVector.forEach((value, index) => {
      if (index === rangeVector.length - 1 || index === 0) return
      const startV = co(value, xAxisYPos + 0.03, ctx)
      const endV = co(value, xAxisYPos - 0.03, ctx)
      const text = co(value, xAxisYPos - 0.05, ctx)
      ctx.beginPath()
      ctx.moveTo(startV.x, startV.y)
      ctx.lineTo(endV.x, endV.y)
      ctx.stroke()

      ctx.globalAlpha = 0.1
      const endVBackground = co(value, 1, ctx)
      ctx.beginPath()
      ctx.moveTo(startV.x, startV.y)
      ctx.lineTo(endVBackground.x, endVBackground.y)
      ctx.stroke()
      ctx.globalAlpha = 1

      //Is reasigned for modularity reasons
      ctx.globalAlpha = 0.5
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      const mediaQuery = window.matchMedia("(min-width: 768px)")
      ctx.font = mediaQuery.matches ? "0.8rem Montserrat" : "0.6rem Montserrat"
      console.log("TIME", data.points[index].time)
      ctx.fillText(new Date(data.points[index].time).toLocaleString("en-US", { month: "short", day: "2-digit" }), text.x, text.y)
      ctx.globalAlpha = 1
    })
  }

  const drawYAxis = (ctx: CanvasRenderingContext2D) => {
    /*
    console.log("Y-values", yValues)
    const start = co(xAxisYPos, -1, ctx)
    const end = co(xAxisYPos, 1, ctx)
    ctx.strokeStyle = "#FFF"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    */

    const maxY = Math.max(...yValues)
    yValues.forEach((value, index) => {
      if (index === yValues.length - 1) return
      const yPos = (value / maxY) * 2 - 1
      const startX = co(-1, yPos, ctx)
      const endX = co(-1 + 0.02, yPos, ctx)
      const mediaQuery = window.matchMedia("(min-width: 768px)")
      const text = co(-1 + (mediaQuery.matches ? 0.05 : 0.1), yPos, ctx)
      ctx.beginPath()
      ctx.moveTo(startX.x, startX.y)
      ctx.lineTo(endX.x, endX.y)
      ctx.stroke()

      ctx.globalAlpha = 0.1
      const endXBackground = co(1, yPos, ctx)
      ctx.beginPath()
      ctx.moveTo(startX.x, startX.y)
      ctx.lineTo(endXBackground.x, endXBackground.y)
      ctx.stroke()
      ctx.globalAlpha = 1

      //Is reasigned for modularity reasons
      ctx.globalAlpha = 0.6
      ctx.textAlign = "center"
      ctx.textBaseline = index !== 10 ? "middle" : "top"
      ctx.font = mediaQuery.matches ? "0.9rem Montserrat" : "0.6rem Montserrat"
      console.log("Font", ctx.font)
      ctx.fillText(value.toString(), text.x, text.y)
      ctx.globalAlpha = 1
    })
  }

  const drawLine = (ctx: CanvasRenderingContext2D) => {
    if (data.points.length === 0) return

    const startTime = data.points[0].time
    const endTime = data.points[data.points.length - 1].time

    const minY = 0
    const maxY = Math.max(...yValues)
    ctx.beginPath()
    data.points.forEach((point, index) => {
      const xPos = (2 * (point.time - startTime)) / (endTime - startTime) - 1
      const yPos = (point.y - minY) / (maxY - minY)
      const pixelPosition = co(xPos, yPos, ctx)

      if (index === 0) {
        ctx.moveTo(pixelPosition.x, pixelPosition.y)
      } else {
        ctx.lineTo(pixelPosition.x, pixelPosition.y)
      }

      ctx.stroke()
    })
    ctx.closePath()
    data.points.forEach((point, index) => {
      const xPos = (2 * (point.time - startTime)) / (endTime - startTime) - 1
      const yPos = (point.y - minY) / (maxY - minY)
      const pixelPosition = co(xPos, yPos, ctx)

      ctx.beginPath()
      ctx.arc(pixelPosition.x, pixelPosition.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
    const ratio = Math.ceil(window.devicePixelRatio)
    ctx.canvas.width = ctx.canvas.offsetWidth * ratio
    ctx.canvas.height = (ctx.canvas.offsetHeight + 5) * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#003F54"
    ctx.fillStyle = "#003F54"
    drawXAxis(ctx)
    drawYAxis(ctx)
    ctx.strokeStyle = "#00C3D0"
    ctx.fillStyle = "#00C3D0"
    ctx.lineWidth = 2
    drawLine(ctx)
  }

  const setupPlot = () => {
    const canvas = document.getElementById(canvasID)! as HTMLCanvasElement
    const ctx = canvas.getContext("2d")!

    resizeCanvas(ctx)
    render(ctx)

    window.addEventListener("resize", () => {
      resizeCanvas(ctx)
      render(ctx)
    })
  }

  onMount(() => setupPlot())
</script>

<canvas id={canvasID} class="w-full aspect-[16/9] bg-transparent" />
