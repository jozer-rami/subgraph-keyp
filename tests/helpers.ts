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

export function organisationCreatedEvent(
  org: string,
  name: string
): OrganisationCreated {
  // let mockEvent = newMockEvent();
  // // let eventParams = new ethereum.EventParam()
  // // let eventParams = new Array()

  // let newOrganisationCreatedEvent = new OrganisationCreated(
  //   mockEvent.address,
  //   mockEvent.logIndex,
  //   mockEvent.transactionLogIndex,
  //   mockEvent.logType,
  //   mockEvent.block,
  //   mockEvent.transaction,
  //   mockEvent.parameters
  // );

  let newOrganisationCreatedEvent = changetype<OrganisationCreated>(newMockEvent())
  newOrganisationCreatedEvent.parameters = new Array();

  let idParam = new ethereum.EventParam("id", ethereum.Value.fromString(org));
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
  // let mockEvent = newMockEvent();
  // let eventParams = new Array();

  // let newGroupCreatedEvent = new GroupCreated(
  //   mockEvent.address,
  //   mockEvent.logIndex,
  //   mockEvent.transactionLogIndex,
  //   mockEvent.logType,
  //   mockEvent.block,
  //   mockEvent.transaction,
  //   eventParams
  // );

  let newGroupCreatedEvent = changetype<GroupCreated>(newMockEvent())
  newGroupCreatedEvent.parameters = new Array();

  let id = org + "-" + group;
  let idParam = new ethereum.EventParam("id", ethereum.Value.fromString(id));
  let orgParam = new ethereum.EventParam(
    "org",
    ethereum.Value.fromAddress(Address.fromString(org))
  );
  let groupParam = new ethereum.EventParam(
    "group",
    ethereum.Value.fromAddress(Address.fromString(group))
  );
  let nameParam = new ethereum.EventParam(
    "name",
    ethereum.Value.fromString(name)
  );
  let adminParam = new ethereum.EventParam(
    "admin",
    ethereum.Value.fromAddress(Address.fromString(admin))
  );
  let parentParam = new ethereum.EventParam(
    "parent",
    ethereum.Value.fromAddress(Address.fromString(parent))
  );

  newGroupCreatedEvent.parameters.push(idParam);
  newGroupCreatedEvent.parameters.push(orgParam);
  newGroupCreatedEvent.parameters.push(groupParam);
  newGroupCreatedEvent.parameters.push(nameParam);
  newGroupCreatedEvent.parameters.push(adminParam);
  newGroupCreatedEvent.parameters.push(parentParam);

  return newGroupCreatedEvent;
}
