const path = require("path");
const expect = require("expect");
const request = require("supertest");

const { app } = require(path.resolve(__dirname + "./../../../server"));
const { adminUser, normalUser, ghostToken } = require(path.resolve(__dirname + "./../../seed/seed"));

describe("GET /client/:clientId", () => {
    it("should return client info to Common users", done => {
        const clientToSearch = {
            id: "50769e92-42c1-423d-9892-443daa57f8b0",
            name: "Deana",
            email: "deanablankenship@quotezart.com",
            role: "user"
        };

        request(app)
            .get(`/client/${clientToSearch.id}`)
            .set("x-auth", normalUser.token)
            .expect(200)
            .expect( response => {
                expect(response.body).toEqual(clientToSearch);
            })
            .end(done);
    });

    it("should return client info to Admin users", done => {
        const clientToSearch = {
            id: "50769e92-42c1-423d-9892-443daa57f8b0",
            name: "Deana",
            email: "deanablankenship@quotezart.com",
            role: "user"
        };

        request(app)
            .get(`/client/${clientToSearch.id}`)
            .set("x-auth", adminUser.token)
            .expect(200)
            .expect( response => {
                expect(response.body).toEqual(clientToSearch);
            })
            .end(done);
    });

    it("should return Client not found when no client found", done => {
        const clientToSearch = {
            id: "748302985758902",
            name: "Ghost client",
            email: "ghost@client.com",
            role: "user"
        };

        request(app)
            .get(`/client/${clientToSearch.id}`)
            .set("x-auth", normalUser.token)
            .expect(404)
            .expect( response => {
                expect(response.text).toBe("Client not found");
            })
            .end(done);
    });

    it("should return Not logged in when no token passed in request headers", done => {
        const clientToSearch = {
            id: "50769e92-42c1-423d-9892-443daa57f8b0",
            name: "Deana",
            email: "deanablankenship@quotezart.com",
            role: "user"
        };

        request(app)
            .get(`/client/${clientToSearch.id}`)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("Not logged in");
            })
            .end(done);
    });

    it("should return Invalid login when token passed in does not match with any user", done => {
        const clientToSearch = {
            id: "50769e92-42c1-423d-9892-443daa57f8b0",
            name: "Deana",
            email: "deanablankenship@quotezart.com",
            role: "user"
        };

        request(app)
            .get(`/client/${clientToSearch.id}`)
            .set("x-auth", ghostToken)
            .expect(401)
            .expect( response => {
                expect(response.text).toEqual("Invalid login");
            })
            .end(done);
    });
});