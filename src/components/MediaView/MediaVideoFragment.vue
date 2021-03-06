<template>
  <div class="media-video-fragment">
    <div class="timeline-container">
      <div class="fragment-duration">
        <div class="start">
          start : <span class="value">{{ formattedIn }}</span>
        </div>
        <div class="end">
          end : <span class="value">{{ formattedOut }}</span>
        </div>
      </div>
      <div class="render-area">
        <div id="strip-container">
          <canvas id="strip"></canvas>
        </div>
        <div id="preview-container">
          <canvas id="preview"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import timelineBase from '../../lib/timelneBase'
  import filmStrip from '../../lib/filmStrip'
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-fragment',
    mixins: [timelineBase, filmStrip],
    data () {
      return {
        canvas: null,
        caret: null
      }
    },
    methods: {
      getFragmentSizeAndPosition () {
        const minWidth = 80
        const headerHeight = 28
        const frameWidth = 4

        let fragmentDuration = this.fgOut - this.fgIn
        let size = this.getCanvasSize()
        let left = (this.fgIn / this.total) * size.width
        let width = (fragmentDuration / this.total) * size.width
        let height = size.height

        if (width < minWidth) {
          width = minWidth
        }

        return {
          minWidth: minWidth,
          headerHeight: headerHeight,
          frameWidth: frameWidth,
          left: left,
          width: width,
          height: height
        }
      },
      updateFragmentSize () {
        let caretSize = this.getFragmentSizeAndPosition()
        let size = this.getCanvasSize()

        if (caretSize.left <= size.width) {
          this.caret.set('left', caretSize.left).setCoords()
          this.canvas.requestRenderAll()
        }

        this.rewindVideo()
      },
      getCanvasSize () {
        let canvasContainer = document.getElementById('preview-container')
        return {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        }
      },
      initCanvas () {
        let size = this.getCanvasSize()

        this.canvas = new fabric.Canvas('preview')
        this.canvas.preserveObjectStacking = true
        this.canvas.selection = true
        this.canvas.setWidth(size.width)
        this.canvas.setHeight(size.height)

        this.canvas.on('object:moving', this.movingObject)
      },
      drawObjects () {
        this.drawCaret()
        this.initFilmStrip()
      },
      drawCaret () {
        let caretSize = this.getFragmentSizeAndPosition()
        let header = new fabric.Rect({left: 0, top: 0, width: caretSize.width, height: caretSize.headerHeight, fill: '#fd4f4f'})
        let leftFrame = new fabric.Rect({
          left: 0,
          top: caretSize.headerHeight,
          width: caretSize.frameWidth,
          height: caretSize.height - caretSize.headerHeight,
          fill: '#fd4f4f'
        })
        let rightFrame = new fabric.Rect({
          left: caretSize.width - caretSize.frameWidth,
          top: caretSize.headerHeight,
          width: caretSize.frameWidth,
          height: caretSize.height - caretSize.headerHeight,
          fill: '#fd4f4f'
        })
        let bottomFrame = new fabric.Rect({
          left: 0,
          top: caretSize.height - caretSize.frameWidth,
          width: caretSize.width,
          height: caretSize.frameWidth,
          fill: '#fd4f4f'
        })

        let group = new fabric.Group([header, leftFrame, rightFrame, bottomFrame], {
          left: caretSize.left,
          top: 0,
          selectable: true,
          hasBorders: false,
          hasControls: false,
          lockMovementY: true
        })

        this.canvas.add(group)
        this.caret = group
      },
    },
    mounted () {
      this.initCanvas()
      this.drawObjects()
      this.handleWindowResize()
    }
  }
</script>
<style lang="scss" scoped>
  .media-video-fragment {
    padding-bottom: 30px;
    .timeline-container {
      position: relative;
      padding: 0 28px;
    }
    .fragment-duration {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 10px;
      z-index: 2;
      font-size: 14px;

      .start, .end {
        position: absolute;
        top: 0;

        .value {
          display: inline-block;
          padding: 4px 6px;
          font-weight: bold;
          line-height: 100%;
          background: #1a1a1a;
          color: #fd4f4f;
        }
      }
      .start {
        left: 28px;
      }
      .end {
        right: 28px;
      }
    }
    .render-area {
      position: relative;
      top: 30px;
      width: 100%;
      height: 107px;
    }
    #preview-container {
      position: absolute;
      width: 100%;
      height: 107px;
      z-index: 20;
      left: 0;
      top: 0;
    }
    #strip-container {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 107px;
    }
  }
</style>
