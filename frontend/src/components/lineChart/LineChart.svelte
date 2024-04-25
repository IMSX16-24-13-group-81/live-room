<script lang="ts">
  import type { LineChartData, Point } from "$lib/data/protocols"
  import { createVector, findIndex, formatDateTime } from "$lib/helpers"
  import { onMount } from "svelte"

  export let data: LineChartData
  export let realData: boolean
  export let noPoints: boolean
  const canvasID = Math.random().toString(16).slice(2)
  const dragCanvasID = Math.random().toString(16).slice(2)
  const xAxisYPos = -0.91
  const rangeVector = createVector(-1, 1, 10)
  let hasMounted = false

  let startTime: number
  let endTime: number

  let pointsAsTimes: number[]

  let yValues: number[]
  let minY: number
  let maxY: number

  let currentHoverPoint: Point | undefined = undefined

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
      //console.log("TIME", data.points[index].time)
      ctx.fillText(
        new Date(data.points[index].time).toLocaleString("en-US", { month: "short", day: "2-digit" }),
        text.x,
        text.y
      )
      ctx.globalAlpha = 1
    })
  }

  const drawYAxis = (ctx: CanvasRenderingContext2D) => {
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

    ctx.beginPath()
    data.points.forEach((point, index) => {
      const xPos = (2 * (point.time - startTime)) / (endTime - startTime) - 1
      const yPos = (2 * (point.y - minY)) / (maxY - minY) - 1
      const pixelPosition = co(xPos, yPos, ctx)

      if (index === 0) {
        ctx.moveTo(pixelPosition.x, pixelPosition.y)
      } else {
        ctx.lineTo(pixelPosition.x, pixelPosition.y)
      }
    })
    ctx.stroke()
    ctx.closePath()
    data.points.forEach((point, index) => {
      const xPos = (2 * (point.time - startTime)) / (endTime - startTime) - 1
      const yPos = (2 * (point.y - minY)) / (maxY - minY) - 1
      const pixelPosition = co(xPos, yPos, ctx)

      ctx.beginPath()
      ctx.arc(pixelPosition.x, pixelPosition.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
    const ratio = Math.ceil(window.devicePixelRatio)
    ctx.canvas.width = ctx.canvas.offsetWidth * ratio
    ctx.canvas.height = ctx.canvas.offsetHeight * ratio
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

  const dragMovement = (x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.strokeStyle = "#003F54"
    ctx.fillStyle = "#003F54"
    ctx.lineWidth = 1
    const startPos = co(0, -1, ctx)
    const endPos = co(0, 1, ctx)
    ctx.beginPath()
    ctx.moveTo(x, startPos.y)
    ctx.lineTo(x, endPos.y)
    ctx.stroke()

    const currentPointIndex = findIndex(pointsAsTimes, startTime + ((endTime - startTime) * x) / ctx.canvas.clientWidth)

    currentHoverPoint = data.points[currentPointIndex]

    const xPos = (2 * (currentHoverPoint.time - startTime)) / (endTime - startTime) - 1
    const yPos = (2 * (currentHoverPoint.y - minY)) / (maxY - minY) - 1
    const pixelPosition = co(xPos, yPos, ctx)

    ctx.beginPath()
    ctx.arc(pixelPosition.x, pixelPosition.y, 6, 0, 2 * Math.PI)
    ctx.fill()
  }

  const dragSetup = (ctx: CanvasRenderingContext2D) => {
    ctx.canvas.addEventListener("mousemove", (e) => {
      dragMovement(e.offsetX, e.offsetY, ctx)
    })

    ctx.canvas.addEventListener("mouseenter", (e) => {
      //backgroundCanvasOpacity = 0.3
    })

    ctx.canvas.addEventListener("mouseleave", (e) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      //backgroundCanvasOpacity = 1
    })

    ctx.canvas.addEventListener(
      "touchmove",
      (e) => {
        const touch = e.touches[0]
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        })
        ctx.canvas.dispatchEvent(mouseEvent)
        dragMovement(mouseEvent.offsetX, mouseEvent.offsetY, ctx)
      },
      false
    )

    ctx.canvas.addEventListener("touchstart", (e) => {
      //backgroundCanvasOpacity = 0.3
    })

    ctx.canvas.addEventListener("touchend", (e) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      //backgroundCanvasOpacity = 1
    })
  }

  const setupDragCanvas = () => {
    const canvas = document.getElementById(dragCanvasID)! as HTMLCanvasElement
    const ctx = canvas.getContext("2d")!

    resizeCanvas(ctx)
    dragSetup(ctx)

    window.addEventListener("resize", () => {
      resizeCanvas(ctx)
      dragSetup(ctx)
    })
  }

  const drawMain = () => {
    if (noPoints) return
    //To update variables that depend on the data prop.
    startTime = data.points[0].time
    endTime = data.points[data.points.length - 1].time
    pointsAsTimes = data.points.map((point) => point.time)
    yValues = Array.from({ length: Math.max(...data.points.map((point) => point.y)) + 1 }, (_, i) => i + 1)
    minY = 0
    maxY = Math.max(...yValues)
    setupPlot()
    setupDragCanvas()
  }

  $: if (hasMounted && data) {
    drawMain()
  }

  onMount(() => {
    drawMain()
    hasMounted = true
  })
</script>

<div class="flex flex-col w-full">
  <p class="font-medium opacity-50 text-smallContent tablet:text-content">
    Currenty selected value, <span class="font-bold"
      >{!currentHoverPoint
        ? "None"
        : `Value: ${currentHoverPoint.y}, Time: ${formatDateTime(new Date(currentHoverPoint.time))}`}</span
    >
  </p>
  <div class="relative w-full aspect-video">
    <canvas id={canvasID} class="absolute w-full aspect-[16/9]" />
    <canvas id={dragCanvasID} class="absolute w-full aspect-[16/9]" />
    <div
      class="absolute w-full aspect-video bg-[#EDF2F3] flex justify-center items-center {realData && !noPoints
        ? 'opacity-0 pointer-events-none'
        : 'opacity-100'}"
    >
      <h2 class="text-smallHeader font-bold opacity-30">{noPoints ? "NO DATA" : "SELECT A ROOM"}</h2>
    </div>
  </div>
</div>
