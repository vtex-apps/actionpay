import { Product } from '../typings/events'

export function getQueryVariable(key: string) {
  const {
    location: { search },
  } = window
  if (!search) return null
  const query = search.substring(1)
  const vars = query.split('&')
  const [{ value = null } = {}] = vars
    .map(item => {
      const [name, value] = item.split('=')
      return { name, value }
    })
    .filter(({ name }) => name === key)
  return value
}

export function getProductPrice(product: Product) {
  const {
    items: [
      {
        sellers: [
          {
            commertialOffer: { Price: price = null },
          },
        ],
      },
    ],
  } = product
  return price
}

export function getCookieByName(cookieName: string): string | null {
  const [{ value = null } = {}] = document.cookie
    .split('; ')
    .map(cookie => {
      const [name, value] = cookie.split('=')
      return { name, value }
    })
    .filter(cookie => cookie)
    .filter(({ name }) => cookieName === name)
  return value
}

export function getUrls(transactionId: string, transactionSubtotal: number) {
  const { actionpayCampaignId: campaignId } = window
  const actionpayCookie = getCookieByName('Actionpay')
  return [
    `//apretailer.com.br/ok/${campaignId}.png?actionpay=${actionpayCookie}&apid=${transactionId}&price=${transactionSubtotal}`,
    `//apypxl.com/ok/${campaignId}.png?actionpay=${actionpayCookie}&apid=${transactionId}&apprice=${transactionSubtotal}`,
  ]
}

export function createImageTags(
  transactionId: string,
  transactionSubtotal: number
): void {
  getUrls(transactionId, transactionSubtotal).map(url => {
    const img = document.createElement('img')
    img.setAttribute('src', url)
    img.setAttribute('height', '0')
    img.setAttribute('width', '0')
    document.body.appendChild(img)
  })
}

export function setActionpayCookie(name: string, value: any): void {
  const {
    actionpayPostclick: daysExpire,
    location: { host: domain },
  } = window
  const date = new Date()
  date.setTime(date.getTime() + daysExpire * 24 * 60 * 60 * 1000)
  var expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; path=/;${expires}; domain=${domain}`
}
