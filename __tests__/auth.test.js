"use strict";

const supertest = require('supertest');
const server = require("../server/server.js");
const { sequelize } = require("../collection");
const base64 = require('base-64');
const request = supertest(server.app);

beforeAll(async () => {
    await sequelize.sync();
});
afterAll(async () => {
    await sequelize.drop();
});

describe("testing auth routes", () => {
    test("should create an user", async () => {
        let response = await request.post('/signup').send({username: 'john', password: 'foo'})

        expect(response.status).toBe(200);
    });
  
    it ('should allow an authenticated header through', async () => {
      let authString = 'john:foo';
      let encodedString = base64.encode(authString);
      let response = await request.post('/signin').set('Authorization', `Basic ${encodedString}`);
      console.log("encoded", encodedString);
      expect(response.status).toEqual(200);
    });
});
