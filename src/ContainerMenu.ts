import { FakeContainer } from "./containers/FakeContainer";
import { ChestContainer } from "./containers/ChestContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./listener/PacketListener";
import { HopperContainer } from "./containers/HopperContainer";
import { DispenserContainer } from "./containers/DispenserContainer";
import { DropperContainer } from "./containers/DropperContainer";
import { ItemStack } from "bdsx/bds/inventory";
import { DoubleChestContainer } from "./containers/DoubleChestContainer";
import { FakeDoubleContainer } from "./containers/FakeDoubleContainer";
import { TrappedChestContainer } from "./containers/TrappedChestContainer";
import { DoubleTrappedChestContainer } from "./containers/DoubleTrappedChestContainer";

PacketListener.loadListeners();

/**
 * All the fake containers types.
 */
export enum FakeContainerType {
    Chest,
    TrappedChest,
    DoubleChest,
    DoubleTrappedChest,
    Hopper,
    Dropper,
    Dispenser,
}

/**
 * All the containers sizes.
 */
export enum ContainerSize {
    Chest = 27,
    DoubleChest = 54,
    Hopper = 5,
    Dropper = 9,
    Dispenser = 9,
}

export type ContainerInventory = Record<number, ItemStack>;
export type FakeContainerAlias = FakeContainer | FakeDoubleContainer;

export namespace ContainerMenu {
    /**
     * Creates a fake container for a specific player.
     *
     * @param player - The player to create the container for.
     * @param container - The container type to create.
     */
    export function create(player: ServerPlayer, container: FakeContainerType, inventory?: ContainerInventory): FakeContainerAlias {
        if(!PlayerManager.hasContainer(player.getNetworkIdentifier())) {
            switch(container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player, inventory);
                case FakeContainerType.TrappedChest:
                    return new TrappedChestContainer(player, inventory);
                case FakeContainerType.DoubleChest:
                    return new DoubleChestContainer(player, inventory);
                case FakeContainerType.DoubleTrappedChest:
                    return new DoubleTrappedChestContainer(player, inventory);
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
