import { FakeContainer } from "./containers/FakeContainer";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { FakeDoubleContainer } from "./containers/FakeDoubleContainer";


export namespace PlayerManager {
    let playerContainerMap: Map<NetworkIdentifier, FakeContainer | FakeDoubleContainer> = new Map();

    export function setContainer(player: NetworkIdentifier, container: FakeContainer | FakeDoubleContainer): void {
        playerContainerMap.set(player, container);
    }

    export function removeContainer(player: NetworkIdentifier): void {
        playerContainerMap.delete(player);
    }

    export function getContainer(player: NetworkIdentifier): FakeContainer | FakeDoubleContainer | undefined {
        return playerContainerMap.get(player);
    }

    export function hasContainer(netId: NetworkIdentifier): boolean {
        return playerContainerMap.has(netId);
    }
}