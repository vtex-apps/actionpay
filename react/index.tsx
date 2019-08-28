import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage, OrderPlacedData } from './typings/events'

import {
  getProductPrice,
  getQueryVariable,
  setActionpayCookie,
  createImageTags,
} from './helpers'

function handleMessages(event: PixelMessage) {
  const { actionpayPartnerId: partnerId = '', APRT_DATA = {} } = window

  if (!partnerId) return console.log('Actionpay Partner ID not set.')

  switch (event.data.eventName) {
    case 'vtex:pageInfo': {
      const { eventType, pageDepartment = '', pageCategory = '' } = event.data
      let eventData: any = {
        pageType: 1,
      }
      if (eventType === 'departmentView' || eventType === 'categoryView') {
        eventData = {
          ...eventData,
          pageType: 3,
          currentCategory: {
            id: '',
            name: pageDepartment || pageCategory,
          },
        }
      }
      window.APRT_DATA = { ...APRT_DATA, ...eventData }
      addTrackingScript()
      break
    }
    case 'vtex:productView': {
      const {
        product,
        product: {
          productId: id,
          productName: name,
          categoryTree: [currentCategory],
        },
      } = event.data
      const price = getProductPrice(product)
      const currentProduct = {
        id,
        name,
        price,
      }
      const eventData = {
        pageType: 2,
        currentCategory,
        currentProduct,
      }
      window.APRT_DATA = { ...APRT_DATA, ...eventData }
      addTrackingScript()
      break
    }
    case 'vtex:orderPlaced': {
      const {
        transactionId,
        transactionProducts,
        transactionSubtotal,
      }: OrderPlacedData = event.data

      const sourcevar = getQueryVariable('utm_source')
      if (sourcevar && sourcevar === 'actionpay') {
        const actionpay = getQueryVariable('actionpay')
        actionpay && setActionpayCookie('Actionpay', actionpay)
      }
      sourcevar && setActionpayCookie('Origem', sourcevar)

      createImageTags(transactionId, transactionSubtotal)

      const purchasedProducts = transactionProducts.map(
        ({ id, name, price, quantity }) => ({
          id,
          name,
          price,
          quantity,
        })
      )

      const orderInfo = {
        id: transactionId,
        totalPrice: transactionSubtotal,
      }

      const eventData = {
        pageType: 6,
        orderInfo,
        purchasedProducts,
      }

      window.APRT_DATA = { ...APRT_DATA, ...eventData }
      addTrackingScript()
      break
    }
    default:
      break
  }
}

function addTrackingScript() {
  const { actionpayPartnerId: partnerId = '' } = window
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = script.defer = true
  script.src = `//aprtn.com/code/${partnerId}/`
  var parent =
    document.getElementsByTagName('body')[0] ||
    document.getElementsByTagName('head')[0]
  parent && parent.appendChild(script)
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
