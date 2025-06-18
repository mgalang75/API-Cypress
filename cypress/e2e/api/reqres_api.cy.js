describe('Reqres.in API Testing', () => {

  // 1. List Users
  it('GET - List Users', () => {
    cy.request('GET', 'https://reqres.in/api/users?page=2')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
  })

  // 2. Single User
  it('GET - Single User', () => {
    cy.request('GET', 'https://reqres.in/api/users/2')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.id).to.eq(2)
      })
  })

  // 3. Single User Not Found
  it('GET - Single User Not Found', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/users/23',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })

  // 4. List <Resource>
  it('GET - List Resources', () => {
    cy.request('GET', 'https://reqres.in/api/unknown')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
  })

  // 5. Single <Resource>
  it('GET - Single Resource', () => {
  cy.request({
    method: 'GET',
    url: 'https://reqres.in/api/unknown/2',
    headers: {
      'x-api-key': 'reqres-free-v1'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.data.id).to.eq(2)
  })
})

  // 6. Single <Resource> Not Found
  it('GET - Single Resource Not Found', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/unknown/23',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })

  // 7. Create User
  it('POST - Create User with API Key', () => {
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/users',
    headers: {
      'x-api-key': 'reqres-free-v1',
    },
    body: {
      name: 'morpheus',
      job: 'leader'
    }
  }).then((response) => {
    expect(response.status).to.eq(201) 
    expect(response.body).to.have.property('name', 'morpheus')
    expect(response.body).to.have.property('job', 'leader')
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('createdAt')
  })
})

  // 8. Update User (PUT)
  it('PUT - Update User with API Key', () => {
  cy.request({
    method: 'PUT',
    url: 'https://reqres.in/api/users/2',
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      name: 'morpheus',
      job: 'zion resident'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('name', 'morpheus')
    expect(response.body).to.have.property('job', 'zion resident')
    expect(response.body).to.have.property('updatedAt')
  })
})

  // 9. Update User (PATCH)
  it('PATCH - Update User with API Key', () => {
  cy.request({
    method: 'PATCH',
    url: 'https://reqres.in/api/users/2',
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      name: 'neo'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('name', 'neo')
    expect(response.body).to.have.property('updatedAt')
  })
})

  // 10. Delete User
  it('DELETE - User with API Key', () => {
  cy.request({
    method: 'DELETE',
    url: 'https://reqres.in/api/users/2',
    headers: {
      'x-api-key': 'reqres-free-v1'
    }
  }).then((response) => {
    expect(response.status).to.eq(204) 
  })
})

  // 11. Register Successful
  it('POST - Register Successful', () => {
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/register',
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      email: 'eve.holt@reqres.in',
      password: 'pistol'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('token')
  })
})

  // 12. Register Unsuccessful
  it('POST - Register Unsuccessful', () => {
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/register',
    failOnStatusCode: false, // karena kita memang mengharapkan error
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      email: 'sydney@fife'
      // tidak ada password
    }
  }).then((response) => {
    expect(response.status).to.eq(400)
    expect(response.body.error).to.eq('Missing password')
  })
})

  // 13. Login Successful
  it('POST - Login Successful', () => {
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/login',
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('token')
  })
})

  // 14. Login Unsuccessful
  it('POST - Login Unsuccessful', () => {
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/login',
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    body: {
      email: 'peter@klaven'
      // Tidak ada password (sengaja untuk test gagal)
    },
    failOnStatusCode: false // agar tidak dianggap gagal saat status bukan 2xx/3xx
  }).then((response) => {
    expect(response.status).to.eq(400) // Setelah API key valid, akan jadi 400
    expect(response.body.error).to.eq('Missing password')
  })
})

  // 15. Delayed Response
  it('GET - Delayed Response', () => {
  cy.request({
    method: 'GET',
    url: 'https://reqres.in/api/users?delay=3',
    headers: {
      'x-api-key': 'reqres-free-v1'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.duration).to.be.greaterThan(2000) // delay = 3 detik
  })
})

// 16. Endpoint Not Found (404)
  it('GET - Single User Not Found (404)', () => {
  cy.request({
    method: 'GET',
    url: 'https://reqres.in/api/users/9999', 
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(404)
    expect(response.body).to.deep.equal({}) 
  })
})

})