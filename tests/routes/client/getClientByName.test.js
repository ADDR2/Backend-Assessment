const path = require("path");
const expect = require("expect");
const request = require("supertest");

const { app } = require(path.resolve(__dirname + "./../../../server"));
const { adminUser, normalUser, ghostToken } = require(path.resolve(__dirname + "./../../seed/seed"));

describe("GET /client/byName/:clientName", () => {
    it("should return clients with given name to Common users", done => {
        const clientToSearch = {
            id: "e994af70-4ae7-49fd-b6a9-fcbb92c61f81",
            name: "Gayle",
            email: "gayleblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/client/byName/${clientToSearch.name}`)
            .set("x-auth", normalUser.token)
            .expect(200)
            .expect( response => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);

                response.body.forEach(client => {
                    expect(client.name).toBe(clientToSearch.name);
                });
            })
            .end(done);
    });

    it("should return clients with given name to Admin users", done => {
        const clientToSearch = {
            id: "e994af70-4ae7-49fd-b6a9-fcbb92c61f81",
            name: "Gayle",
            email: "gayleblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/client/byName/${clientToSearch.name}`)
            .set("x-auth", adminUser.token)
            .expect(200)
            .expect( response => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
                
                response.body.forEach(client => {
                    expect(client.name).toBe(clientToSearch.name);
                });
            })
            .end(done);
    });

    it("should return No client found when no client found with given name", done => {
        const clientToSearch = {
            id: "748302985758902",
            name: "Ghost client",
            email: "ghost@client.com",
            role: "user"
        };

        request(app)
            .get(`/client/byName/${clientToSearch.name}`)
            .set("x-auth", normalUser.token)
            .expect(404)
            .expect( response => {
                expect(response.text).toBe("No client found");
            })
            .end(done);
    });

    it("should return Not logged in when no token passed in request headers", done => {
        const clientToSearch = {
            id: "e994af70-4ae7-49fd-b6a9-fcbb92c61f81",
            name: "Gayle",
            email: "gayleblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/client/byName/${clientToSearch.name}`)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("Not logged in");
            })
            .end(done);
    });

    it("should return Invalid login when token passed in does not match with any user", done => {
        const clientToSearch = {
            id: "e994af70-4ae7-49fd-b6a9-fcbb92c61f81",
            name: "Gayle",
            email: "gayleblankenship@quotezart.com",
            role: "admin"
        };

        request(app)
            .get(`/client/byName/${clientToSearch.name}`)
            .set("x-auth", ghostToken)
            .expect(401)
            .expect( response => {
                expect(response.text).toEqual("Invalid login");
            })
            .end(done);
    });
});