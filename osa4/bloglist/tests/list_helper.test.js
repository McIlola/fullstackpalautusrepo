const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
	test('dummy returns one', () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	assert.strictEqual(result, 1)
	})
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

	test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Author One',
      url: 'http://example.com/1',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Author Two',
      url: 'http://example.com/2',
      likes: 12,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Author Three',
      url: 'http://example.com/3',
      likes: 7,
    },
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })

  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})