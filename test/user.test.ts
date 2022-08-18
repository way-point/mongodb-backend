import startServer from '../src/index';

import request from 'supertest';

import configJson from './config.json';
import queryJson from './query.json';

import mongoose from 'mongoose';

const axios = require('axios');

const url = configJson.url


describe('demo', () => {
  let server, url:string;

  beforeAll(async () => {
    ({server, url} = await startServer(3001));
  })

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  })
  
  let aliceFields:object, bobFields:object, malloryFields:object;

  it('Creating Alice, Bob, and Mallory', async () => {
    aliceFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"alice001","password":"alicepassword","email":"alice@nextchart.com"}},
    });

    bobFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"bob002","password":"alicepassword","email":"bob@nextchart.com"}},
    });

    malloryFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"mallory003","password":"alicepassword","email":"mallory@nextchart.com"}},
    });
  });

  it('Recreating Alice, Bob, Mallory w/ errors', async () => {
    // Duplicate username
    const aliceFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"alice001","password":"alicepassword","email":"alice@nextchart.com"}},
    });

    // Invalid email
    const bobFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"bob002","password":"bobpassword","email":"com"}},
    });

    // Missing Password
    const malloryFields = await server.executeOperation({
      query: queryJson.registerUser,
      variables: {"registerInput":{"username":"mallory003","password":"","email":"mallory@nextchart.com"}},
    });

    console.log(aliceFields.errors)
  })
  it('Query existing user', async () => {
    const result = await server.executeOperation({
      query: queryJson.fetchUser,
      variables: {"username":"CPTforever"},
    });
    
    expect(result.data.ifUserFound).toBe(true);
  });
  
  
})
