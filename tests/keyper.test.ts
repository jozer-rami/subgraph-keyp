import { ethereum, Value } from "@graphprotocol/graph-ts";
import { describe, test, assert, clearStore, afterEach } from "matchstick-as/assembly/index"
import { Group, Organization } from "../generated/schema";
import { handleGroupCreated, handleOrganisationCreated } from "../src/mapping";
import { organisationCreatedEvent, groupCreatedEvent, handleNewOrganisations, getGroupID, handleNewGroups } from "./helpers";

// Coverage
export { handleOrganisationCreated, handleGroupCreated}

const org1 : string = '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7'
const group1 : string = '0x44609982b2e83ca5c348bba453bfa8363e8a2c22'
const childGroup : string = '0x662E48dA233FF7781a87bf4c36fCefa3467f9934'

describe("handleOrganisationCreated()", () => {
    test("Should create a new organisation entity", () => {
        // Mock event
        let mockOrgCreatedEvent1 = organisationCreatedEvent('0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7', 'test Org 1')
        let mockOrgCreatedEvent2 = organisationCreatedEvent('0x662E48dA233FF7781a87bf4c36fCefa3467f9934', 'test Org 2')

        // Call mapping handling function
        handleNewOrganisations([mockOrgCreatedEvent1, mockOrgCreatedEvent2])

          // Assert the state of the store
        assert.fieldEquals('Organization', '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7', 'name', 'test Org 1')
        assert.fieldEquals('Organization', '0x662e48da233ff7781a87bf4c36fcefa3467f9934', 'name', 'test Org 2')

        // Clear the store in order to start the next test off on a clean slate
        clearStore()
    })
  })

describe("handleGroupCreated()", () => {
    afterEach(() => {
      clearStore()
    })

    test("Should create a new group entity", () => {
      let customOrg = new Organization(org1);
      customOrg.set("name", Value.fromString("testORg1"));
      customOrg.save();

      let mockGroupCreatedEvent1 = groupCreatedEvent(org1, group1, 'group1', org1, org1)
      handleNewGroups([mockGroupCreatedEvent1])

      let groupId = getGroupID(org1, group1)
      assert.fieldEquals('Group', groupId, 'name', 'group1')
      assert.fieldEquals('Group', groupId, 'admin', org1)
      assert.fieldEquals('Group', groupId, 'parent', org1)
      assert.fieldEquals('Group', groupId, 'org', org1)
  })

    test("Should create child reference in organization", () => {
      let mockOrgCreatedEvent = organisationCreatedEvent(org1, 'test Org 1')
      handleNewOrganisations([mockOrgCreatedEvent])

      let mockGroupCreatedEvent1 = groupCreatedEvent(org1, group1, 'group1', org1, org1)
      handleNewGroups([mockGroupCreatedEvent1])

      // Retrieve org from store
      let org = Organization.load(org1) as Organization
      assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(org.child.length))
    })

    test("Should create child reference in group", () => {
      let mockOrgCreatedEvent = organisationCreatedEvent(org1, 'test Org 1')
      handleNewOrganisations([mockOrgCreatedEvent])

      let mockGroupCreatedEvent1 = groupCreatedEvent(org1, group1, 'group1', org1, org1)
      let mockChildGroupCreatedEvent1 = groupCreatedEvent(org1, childGroup, 'child group1', org1, group1)

      handleNewGroups([mockGroupCreatedEvent1, mockChildGroupCreatedEvent1])
      // Retrieve group1 from store
      let group1Id = getGroupID(org1, group1)
      let group = Group.load(group1Id) as Group
      assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(group.child.length))
    })
})
