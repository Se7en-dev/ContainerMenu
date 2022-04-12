import { FakeContainer } from "./containers/FakeContainer";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { FakeDoubleContainer } from "./containers/FakeDoubleContainer";
import { FakeContainerAlias } from "./ContainerMenu";


export namespace PlayerManager {
    let playerContainerMap: Map<NetworkIdentifier, FakeContainerAlias> = new Map();

    export function setContainer(player: NetworkIdentifier, container: FakeContainerAlias): void {
        playerContainerMap.set(player, container);
    }

    export function removeContainer(player: NetworkIdentifier): void {
        playerContainerMap.delete(player);
    }

    export function getContainer(player: NetworkIdentifier): FakeContainerAlias | undefined {
        return playerContainerMap.get(player);
    }

    export function hasContainer(netId: NetworkIdentifier): boolean {
        return playerContainerMap.has(netId);
    }
}