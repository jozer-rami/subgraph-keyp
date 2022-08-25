import { BigInt } from "@graphprotocol/graph-ts"
import {
  KeyperModule,
  GroupCreated,
  OrganisationCreated,
  TxOnBehalfExecuted
} from "../generated/KeyperModule/KeyperModule"
import { Group, Organization } from "../generated/schema"

export function handleGroupCreated(event: GroupCreated): void {
  let orgId = event.params.org.toString()
  let org = Organization.load(orgId)
  
  if (org == null) return // Should not happen, type check
  // TODO: Check if we need hash this and make an other type of ID?
  let groupId = org.id + "-" + event.params.group.toString()
  let group = Group.load(groupId)

  if (group == null) {
    group = new Group(groupId)
    group.name = event.params.name
    group.org = org.id
    group.admin = event.params.admin.toString()
    let parentId = org.id + "-" +event.params.parent.toString()
    group.parent = parentId
    group.save()
  }
}

export function handleOrganisationCreated(event: OrganisationCreated): void {
  let org = new Organization(event.params.org.toString())
  org.name = event.params.name
  org.save()
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