import { handleGroupCreated, handleOrganisationCreated } from "../src/mapping";
import {
  KeyperModule,
  GroupCreated,
  OrganisationCreated,
} from "../generated/KeyperModule/KeyperModule";
import {
  Address,
  ethereum,
  JSONValue,
  Value,
  ipfs,
  json,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";

export function handleNewGroups(events: GroupCreated[]): void {
  events.forEach((event) => {
    handleGroupCreated(event);
  });
}

export function handleNewOrganisations(events: OrganisationCreated[]): void {
  events.forEach((event) => {
    handleOrganisationCreated(event);
  });
}

function getAddressParam(label: string, address: string): ethereum.EventParam {
  let param = new ethereum.EventParam(label, ethereum.Value.fromAddress(Address.fromString(address)));
  return param;
}

export function getGroupID(org:string, group: string) : string {
  return org + "-" + group
}

export function organisationCreatedEvent(
  org: string,
  name: string
): OrganisationCreated {
  let newOrganisationCreatedEvent = changetype<OrganisationCreated>(newMockEvent())
  newOrganisationCreatedEvent.parameters = new Array();

  let idParam = new ethereum.EventParam(
    "id",
    ethereum.Value.fromAddress(Address.fromString(org))
  );
  let nameParam = new ethereum.EventParam(
    "name",
    ethereum.Value.fromString(name)
  );

  newOrganisationCreatedEvent.parameters.push(idParam);
  newOrganisationCreatedEvent.parameters.push(nameParam);

  return newOrganisationCreatedEvent;
}

export function groupCreatedEvent(
  org: string,
  group: string,
  name: string,
  admin: string,
  parent: string
): GroupCreated {

  let newGroupCreatedEvent = changetype<GroupCreated>(newMockEvent())
  newGroupCreatedEvent.parameters = new Array();

  let orgParam = getAddressParam("org", org)
  let groupParam = getAddressParam("group", group)
  let nameParam = new ethereum.EventParam(
    "name",
    ethereum.Value.fromString(name)
  );
  let adminParam = getAddressParam("admin", admin)
  let parentParam = getAddressParam("parent", parent)

  newGroupCreatedEvent.parameters.push(orgParam);
  newGroupCreatedEvent.parameters.push(groupParam);
  newGroupCreatedEvent.parameters.push(nameParam);
  newGroupCreatedEvent.parameters.push(adminParam);
  newGroupCreatedEvent.parameters.push(parentParam);

  return newGroupCreatedEvent;
}
