import { FakeContainer } from "./containers/FakeContainer";
import { ChestContainer } from "./containers/ChestContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./listener/PacketListener";
import { HopperContainer } from "./containers/HopperContainer";
import { DispenserContainer } from "./containers/DispenserContainer";
import { DropperContainer } from "./containers/DropperContainer";
import { ItemStack } from "bdsx/bds/inventory";

PacketListener.loadListeners();

/**
 * All the fake containers types.
 */
export enum FakeContainerType {
    Chest,
    Hopper,
    Dropper,
    Dispenser,
}

/**
 * All the containers sizes.
 */
export enum ContainerSize {
    Chest = 27,
    Hopper = 5,
    Dropper = 9,
    Dispenser = 9,
}

export type ContainerInventory = Record<number, ItemStack>;

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
                case FakeContainerType.Hopper:
                    return new HopperContainer(player, inventory);
                case FakeContainerType.Dropper:
                    return new DropperContainer(player, inventory);
                case FakeContainerType.Dispenser:
                    return new DispenserContainer(player, inventory);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }
}
