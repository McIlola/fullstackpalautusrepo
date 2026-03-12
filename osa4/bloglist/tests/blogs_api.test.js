const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are initially some blogs saved', () => {
  let token = ''
  let initialBlogs = []

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }

    await api.post('/api/users').send(user)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = loginResponse.body.token

    const blog1 = { 
      title: 'First blog', 
      author: 'Author One', 
      url: 'http://example.com/1', 
      likes: 5 
    }
    const blog2 = { 
      title: 'Second blog', 
      author: 'Author Two', 
      url: 'http://example.com/2', 
      likes: 10 
    }

    const response1 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog1)
    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog2)

    initialBlogs = [response1.body, response2.body]
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog posts have property id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Async/Await in Node',
        author: 'FSO',
        url: 'https://fullstackopen.com',
        likes: 8,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
  })
  
  test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length-1)
    
    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate.toJSON(),
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })

  test('blog can be added with valid token', async () => {
    const newBlog = {
      title: 'Token blog',
      author: 'Auth Tester',
      url: 'http://example.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
  })

  test('blog creation fails without token', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'No Token',
      url: 'http://fail.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

test('cleanup', async () => {
  await mongoose.connection.close()
})
