import { describe, test, beforeAll, assert, clearStore } from "matchstick-as/assembly/index"
import { Organization } from "../generated/schema";
import { handleGroupCreated, handleOrganisationCreated } from "../src/mapping";
import { organisationCreatedEvent, groupCreatedEvent, handleNewOrganisations } from "./helpers";

// beforeAll(() => {
//     // TODO create 
//     let org = new Organization("0x01")
//     org.name = "Main Org Test Root"
//     org.save()
// })

describe("handleOrganisationCreated()", () => {
    test("Should create a new organisation entity", () => {
        // Mock event
        let mockOrgCreatedEvent1 = organisationCreatedEvent('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'test Org 1')
        let mockOrgCreatedEvent2 = organisationCreatedEvent('0xA16081F360e3847006dB660bae1c6d1b2e17eC2A', 'test Org 2')

        // Call mapping handling function
        handleNewOrganisations([mockOrgCreatedEvent1, mockOrgCreatedEvent2])

          // Assert the state of the store
        assert.fieldEquals('Organization', '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'name', 'test Org 1')
        assert.fieldEquals('Organization', '0x67205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'name', 'test Org 2')

        // Clear the store in order to start the next test off on a clean slate
        clearStore()
    })
  })

// describe("handleGroupCreated()", () => {
//   test("Should create a new group entity", () => {
//     // let newGravatarEvent = createNewGravatarEvent(12345, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')
//     let mockCreateGroupEvent = createGroupEvent('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', '0x89205A3A3b2A69De6Dbf7f01ED13B1108B2c43e7', 'testOrg', '0x0', '0x0')
//   })
// })

// describe("handleOrganisationCreated()", () => {
//     test("Should create a new organisation entity", () => {
  
//   })
// })