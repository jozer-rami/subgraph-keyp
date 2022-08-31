import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  KeyperModule,
  GroupCreated,
  OrganisationCreated,
  TxOnBehalfExecuted,
} from "../generated/KeyperModule/KeyperModule";
import { Group, Organization } from "../generated/schema";

export function handleGroupCreated(event: GroupCreated): void {
  let orgId = event.params.org.toHexString();
  let groupId = orgId + "-" + event.params.group.toHexString();
  let group = Group.load(groupId);

  if (group == null) {
    group = new Group(groupId);
    group.name = event.params.name;
    group.org = orgId;
    group.admin = event.params.admin;
    let parentId : string
    if (event.params.org.toHexString() == event.params.parent.toHexString()) {
      parentId = orgId
    } else {
      // Parent is a group : need to reference groupID
      parentId = orgId + "-" + event.params.parent.toHexString();
    }
    group.parent = parentId;
    group.save();
  }
}

export function handleOrganisationCreated(event: OrganisationCreated): void {
  let org = new Organization(event.params.org.toHexString());
  org.name = event.params.name;
  org.save();
}

export function handleTxOnBehalfExecuted(event: TxOnBehalfExecuted): void {}

// Note: If a handler doesn't require existing field values, it is faster
// _not_ to load the entity from the store. Instead, create it fresh with
// `new Entity(...)`, set the fields that should be updated and save the
// entity back to the store. Fields that were not set or unset remain
// unchanged, allowing for partial updates to be applied.

// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract.NAME(...)
// - contract.VERSION(...)
// - contract.domainSeparator(...)
// - contract.encodeTransactionData(...)
// - contract.getChainId(...)
// - contract.getGroupInfo(...)
// - contract.getOrg(...)
// - contract.getTransactionHash(...)
// - contract.groups(...)
// - contract.isAdmin(...)
// - contract.isChild(...)
// - contract.isOrgRegistered(...)
// - contract.isParent(...)
// - contract.masterCopy(...)
// - contract.nonce(...)
// - contract.orgs(...)
// - contract.proxyFactory(...)
