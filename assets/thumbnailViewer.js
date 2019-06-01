import svgPanZoom from 'svg-pan-zoom'

const thumbnailViewer = function (options) {
  const getSVGDocument = function (objectElem) {
    let svgDoc = objectElem.contentDocument
    if (!svgDoc) {
      svgDoc = objectElem.getSVGDocument()
    }
    return svgDoc
  }

  const bindThumbnail = function (main, thumb) {
    if (!window.main && main) {
      window.main = main
    }
    if (!window.thumb && thumb) {
      window.thumb = thumb
    }
    if (!window.main || !window.thumb) {
      return
    }

    let resizeTimer
    const interval = 300 // msec
    window.addEventListener('resize', function (event) {
      if (resizeTimer !== false) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(function () {
        window.main.resize()
        window.thumb.resize()
      }, interval)
    })

    window.main.setOnZoom(function (level) {
      window.thumb.updateThumbScope()
      if (options.onZoom) {
        options.onZoom(window.main, window.thumb, level)
      }
    })

    window.main.setOnPan(function (point) {
      window.thumb.updateThumbScope()
      if (options.onPan) {
        options.onPan(window.main, window.thumb, point)
      }
    })

    const _updateThumbScope = function (main, thumb, scope, line1, line2) {
      const mainPanX = main.getPan().x
      const mainPanY = main.getPan().y
      const mainWidth = main.getSizes().width
      const mainHeight = main.getSizes().height
      const mainZoom = main.getSizes().realZoom
      const thumbPanX = thumb.getPan().x
      const thumbPanY = thumb.getPan().y
      const thumbZoom = thumb.getSizes().realZoom

      const thumByMainZoomRatio = thumbZoom / mainZoom

      const scopeX = thumbPanX - mainPanX * thumByMainZoomRatio
      const scopeY = thumbPanY - mainPanY * thumByMainZoomRatio
      const scopeWidth = mainWidth * thumByMainZoomRatio
      const scopeHeight = mainHeight * thumByMainZoomRatio

      scope.setAttribute('x', scopeX + 1)
      scope.setAttribute('y', scopeY + 1)
      scope.setAttribute('width', scopeWidth - 2)
      scope.setAttribute('height', scopeHeight - 2)
      /*
        line1.setAttribute("x1", scopeX + 1);
        line1.setAttribute("y1", scopeY + 1);
        line1.setAttribute("x2", scopeX + 1 + scopeWidth - 2);
        line1.setAttribute("y2", scopeY + 1 + scopeHeight - 2);
        line2.setAttribute("x1", scopeX + 1);
        line2.setAttribute("y1", scopeY + 1 + scopeHeight - 2);
        line2.setAttribute("x2", scopeX + 1 + scopeWidth - 2);
        line2.setAttribute("y2", scopeY + 1);
      */
    }

    window.thumb.updateThumbScope = function () {
      const scope = document.getElementById('scope')
      const line1 = document.getElementById('line1')
      const line2 = document.getElementById('line2')
      _updateThumbScope(window.main, window.thumb, scope, line1, line2)
    }
    window.thumb.updateThumbScope()

    const _updateMainViewPan = function (clientX, clientY, scopeContainer, main, thumb) {
      const dim = scopeContainer.getBoundingClientRect()
      // const mainWidth = main.getSizes().width
      // const mainHeight = main.getSizes().height
      const mainZoom = main.getSizes().realZoom
      const thumbWidth = thumb.getSizes().width
      const thumbHeight = thumb.getSizes().height
      const thumbZoom = thumb.getSizes().realZoom

      const thumbPanX = clientX - dim.left - thumbWidth / 2
      const thumbPanY = clientY - dim.top - thumbHeight / 2
      const mainPanX = -thumbPanX * mainZoom / thumbZoom
      const mainPanY = -thumbPanY * mainZoom / thumbZoom
      main.pan({ x: mainPanX, y: mainPanY })
    }

    const updateMainViewPan = function (evt) {
      if (evt.which === 0 && evt.button === 0) {
        return false
      }
      const scopeContainer = document.getElementById('scopeContainer')
      _updateMainViewPan(evt.clientX, evt.clientY, scopeContainer, window.main, window.thumb)
    }

    const scopeContainer = document.getElementById('scopeContainer')
    scopeContainer.addEventListener('click', function (evt) {
      updateMainViewPan(evt)
    })

    scopeContainer.addEventListener('mousemove', function (evt) {
      updateMainViewPan(evt)
    })
  }

  const mainViewObjectElem = document.getElementById(options.mainViewId)
  mainViewObjectElem.addEventListener('load', function () {
    const mainViewSVGDoc = getSVGDocument(mainViewObjectElem)
    if (options.onMainViewSVGLoaded) {
      options.onMainViewSVGLoaded(mainViewSVGDoc)
    }

    const beforePan = function (oldPan, newPan) {
      // const stopHorizontal = false
      // const stopVertical = false
      const gutterWidth = 100
      const gutterHeight = 100
      // Computed variables
      const sizes = this.getSizes()
      const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
      const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
      const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
      const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
      const customPan = {}
      customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
      customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
      return customPan
    }

    const main = svgPanZoom('#' + options.mainViewId, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      beforePan: beforePan
    })

    bindThumbnail(main, undefined)
    if (options.onMainViewShown) {
      options.onMainViewShown(mainViewSVGDoc, main)
    }
  }, false)

  const thumbViewObjectElem = document.getElementById(options.thumbViewId)
  thumbViewObjectElem.addEventListener('load', function () {
    const thumbViewSVGDoc = getSVGDocument(thumbViewObjectElem)
    if (options.onThumbnailSVGLoaded) {
      options.onThumbnailSVGLoaded(thumbViewSVGDoc)
    }

    const thumb = svgPanZoom('#' + options.thumbViewId, {
      zoomEnabled: false,
      panEnabled: false,
      controlIconsEnabled: false,
      dblClickZoomEnabled: false,
      preventMouseEventsDefault: true
    })

    bindThumbnail(undefined, thumb)
    if (options.onThumbnailShown) {
      options.onThumbnailShown(thumbViewSVGDoc, thumb)
    }
  }, false)
}

export { thumbnailViewer }
