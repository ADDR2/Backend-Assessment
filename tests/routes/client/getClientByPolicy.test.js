const path = require("path");
const expect = require("expect");
const request = require("supertest");

const { app } = require(path.resolve(__dirname + "./../../../server"));
const { adminUser, normalUser, ghostToken } = require(path.resolve(__dirname + "./../../seed/seed"));

describe("GET /client/byPolicy/:policyId", () => {
    it("should return client info by policy number to Admin users", done => {
        const policyToSearch = {
            id: "56b415d6-53ee-4481-994f-4bffa47b5239",
            amountInsured: 2301.98,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2014-12-01T05:53:13Z",
            installmentPayment: false,
            clientId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
        };

        request(app)
            .get(`/client/byPolicy/${policyToSearch.id}`)
            .set("x-auth", adminUser.token)
            .expect(200)
            .expect( response => {
                expect(response.body).toHaveProperty('id', policyToSearch.clientId);
            })
            .end(done);
    });

    it("should return Access denied to Common users", done => {
        const policyToSearch = {
            id: "56b415d6-53ee-4481-994f-4bffa47b5239",
            amountInsured: 2301.98,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2014-12-01T05:53:13Z",
            installmentPayment: false,
            clientId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
        };

        request(app)
            .get(`/client/byPolicy/${policyToSearch.id}`)
            .set("x-auth", normalUser.token)
            .expect(403)
            .expect( response => {
                expect(response.text).toEqual("Access denied");
            })
            .end(done);
    });

    it("should return Policy not found when no policy found", done => {
        const policyToSearch = {
            id: "748302985758902",
            amountInsured: 32,
            email: "ghost@policy.com",
            inceptionDate: "2014-12-01T05:53:13Z",
            installmentPayment: false,
            clientId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
        };

        request(app)
            .get(`/client/byPolicy/${policyToSearch.id}`)
            .set("x-auth", adminUser.token)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("Policy not found");
            })
            .end(done);
    });

    it("should return Not logged in when no token passed in request headers", done => {
        const policyToSearch = {
            id: "56b415d6-53ee-4481-994f-4bffa47b5239",
            amountInsured: 2301.98,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2014-12-01T05:53:13Z",
            installmentPayment: false,
            clientId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
        };

        request(app)
            .get(`/client/byPolicy/${policyToSearch.id}`)
            .expect(500)
            .expect( response => {
                expect(response.text).toEqual("Not logged in");
            })
            .end(done);
    });

    it("should return Invalid login when token passed in does not match with any user", done => {
        const policyToSearch = {
            id: "56b415d6-53ee-4481-994f-4bffa47b5239",
            amountInsured: 2301.98,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2014-12-01T05:53:13Z",
            installmentPayment: false,
            clientId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
        };

        request(app)
            .get(`/client/byPolicy/${policyToSearch.id}`)
            .set("x-auth", ghostToken)
            .expect(401)
            .expect( response => {
                expect(response.text).toEqual("Invalid login");
            })
            .end(done);
    });
});