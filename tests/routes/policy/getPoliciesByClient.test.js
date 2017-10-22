const path = require("path");
const expect = require("expect");
const request = require("supertest");

const { app } = require(path.resolve(__dirname + "./../../../server"));
const { adminUser, normalUser, ghostToken } = require(path.resolve(__dirname + "./../../seed/seed"));

describe("GET /policy/:clientName", () => {
    it("should return list of policies by client name to Admin users", done => {
        const client = {
            id: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
            name: "Manning",
            email: "manningblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .set("x-auth", adminUser.token)
            .expect(200)
            .expect( response => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
                
                response.body.forEach(policy => {
                    expect(policy.clientId).toBe(client.id);
                });
            })
            .end(done);
    });

    it("should return Access denied to Common users", done => {
        const client = {
            id: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
            name: "Manning",
            email: "manningblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .set("x-auth", normalUser.token)
            .expect(403)
            .expect( response => {
                expect(response.text).toEqual("Access denied");
            })
            .end(done);
    });

    it("should return No client found when no client found with given name", done => {
        const client = {
            id: "748302985758902",
            name: "Ghost client",
            email: "ghost@client.com",
            role: "user"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .set("x-auth", adminUser.token)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("No client found");
            })
            .end(done);
    });

    it("should return Client(s) with no policies when no policy found for given user(s)", done => {
        const client = {
            id: "a3b8d425-2b60-4ad7-becc-bedf2ef860bd",
            name: "Barnett",
            email: "barnettblankenship@quotezart.com",
            role: "user"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .set("x-auth", adminUser.token)
            .expect(404)
            .expect( response => {
                expect(response.text).toEqual("Client(s) with no policies");
            })
            .end(done);
    });

    it("should return Not logged in when no token passed in request headers", done => {
        const client = {
            id: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
            name: "Manning",
            email: "manningblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("Not logged in");
            })
            .end(done);
    });

    it("should return Invalid login when token passed in does not match with any user", done => {
        const client = {
            id: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
            name: "Manning",
            email: "manningblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/policy/${client.name}`)
            .set("x-auth", ghostToken)
            .expect(401)
            .expect( response => {
                expect(response.text).toEqual("Invalid login");
            })
            .end(done);
    });
});