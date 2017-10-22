const path = require("path");
const expect = require("expect");
const request = require("supertest");

const { app } = require(path.resolve(__dirname + "./../../../server"));

describe("GET /client/login", () => {
    it("should return user and token x-auth header", done => {
        const data = {
            email: "whitleyblankenship@quotezart.com"
        };

        request(app)
            .post("/client/login")
            .send(data)
            .expect(200)
            .expect( response => {
                expect(response.headers["x-auth"]).toBeDefined();
            })
            .end(done);
    });

    it("should return No email given when no email found in request params", done => {
        const data = {};

        request(app)
            .post("/client/login")
            .send(data)
            .expect(500)
            .expect( response => {
                expect(response.text).toBe("No email given");
            })
            .end(done);
    });

    it("should return Client not found when client email not found", done => {
        const data = {
            email: "not.found@email.com"
        };
        
        request(app)
            .post("/client/login")
            .send(data)
            .expect(404)
            .expect( response => {
                expect(response.text).toBe("Client not found");
            })
            .end(done);
    });

});