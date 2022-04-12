import { ContainerInventory, FakeContainer, FakeContainerType } from "./containers/FakeContainer";
import { ChestContainer } from "./containers/ChestContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./listener/PacketListener";

PacketListener.loadListeners();

export namespace ContainerMenu {
    /**
     * Creates a fake container for a specific player.
     *
     * @param player - The player to create the container for.
     * @param container - The container type to create.
     */
    export function create(player: ServerPlayer, container: FakeContainerType, inventory?: ContainerInventory): FakeContainer {
        if(!PlayerManager.hasContainer(player.getNetworkIdentifier())) {
            switch(container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player, inventory);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }
}
