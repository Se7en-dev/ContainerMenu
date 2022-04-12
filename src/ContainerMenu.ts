import { FakeContainerType } from "./containers/FakeContainer";
import { ChestContainer } from "./containers/ChestContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./listener/PacketListener";

PacketListener.loadListeners();

export namespace ContainerMenu {
    export function create(player: ServerPlayer, container: FakeContainerType) {
        if(!PlayerManager.hasContainer(player.getNetworkIdentifier())) {
            switch(container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }
}
