import {
  getQueryVariable,
  getProductPrice,
  setActionpayCookie,
  getCookieByName,
} from '../helpers'

import { Product } from '../typings/events'

describe('getQueryVariable', () => {
  test('it should return null if no url', () => {
    window.history.pushState({}, 'Test', '/test')
    expect(getQueryVariable('foo')).toBeNull()
  })
  test('it should return the query string value ', () => {
    window.history.pushState({}, 'Test', '/test?foo=bar')
    expect(getQueryVariable('foo')).toBe('bar')
    window.history.pushState({}, 'Test', '/test?foo=bar&baz=fizz')
    expect(getQueryVariable('baz')).toBe('fizz')
  })
  test('it will return null if not found value', () => {
    window.history.pushState(
      {},
      'Test',
      '/checkout/orderPlaced/?og=957261794487'
    )
    expect(getQueryVariable('foo')).toBeNull()
  })
})

describe('getProductPrice', () => {
  test('it should return null if no price', () => {
    const product: Product = {
      productId: '',
      productName: '',
      brand: '',
      categories: [''],
      sku: {
        itemId: '',
        name: '',
      },
      items: [
        {
          itemId: '',
          name: '',
          sellers: [
            {
              commertialOffer: {},
            },
          ],
        },
      ],
    }
    expect(getProductPrice(product)).toBeNull()
  })
  test('it should return the product price', () => {
    const product: Product = {
      productId: '',
      productName: '',
      brand: '',
      categories: [''],
      sku: {
        itemId: '',
        name: '',
      },
      items: [
        {
          itemId: '',
          name: '',
          sellers: [
            {
              commertialOffer: {
                Price: 199,
              },
            },
          ],
        },
      ],
    }
    expect(getProductPrice(product)).toBe(199)
  })
})

describe('getCookieByName', () => {
  test('it returns null if no cookie found', () => {
    document.cookie = 'foo=bar'
    expect(getCookieByName('bar')).toBeNull()
  })
  test('it gets a cookie value that has a certain name', () => {
    document.cookie = 'foo=bar'
    expect(getCookieByName('foo')).toBe('bar')
  })
})

describe('setActionpayCookie', () => {
  test('it sets a cookie with a value', () => {
    setActionpayCookie('foo', 'bar')
    expect(getCookieByName('foo')).toBe('bar')
  })
})
