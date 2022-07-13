/*
          _____                    _
  ___  __|___  |__ _ __         __| | _____   __
 / __|/ _ \ / / _ \ '_ \ _____ / _` |/ _ \ \ / /
 \__ \  __// /  __/ | | |_____| (_| |  __/\ V /
 |___/\___/_/ \___|_| |_|      \__,_|\___| \_/

  ContainerMenu - An API for BDSX that allows you to create fake interactive container menus !

 */

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

export namespace ContainerMenu {
    /**
     * Creates a fake container for a specific player.
     *
     * @param player - The player to create the container for.
     * @param container - The container type to create.
     * @param destructItems - Whether the ItemStacks should be automatically destructed.
     * @param inventory - The inventory of the container.
     */
    export function create(player: ServerPlayer, container: FakeContainerType, destructItems?: boolean, inventory?: ContainerInventory): FakeContainer {
        if(!PlayerManager.hasContainer(player.getNetworkIdentifier())) {
            switch(container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player, destructItems, inventory);
                case FakeContainerType.TrappedChest:
                    return new TrappedChestContainer(player, destructItems, inventory);
                case FakeContainerType.DoubleChest:
                    return new DoubleChestContainer(player, destructItems, inventory);
                case FakeContainerType.DoubleTrappedChest:
                    return new DoubleTrappedChestContainer(player, destructItems, inventory);
                case FakeContainerType.Hopper:
                    return new HopperContainer(player, destructItems, inventory);
                case FakeContainerType.Dropper:
                    return new DropperContainer(player, destructItems, inventory);
                case FakeContainerType.Dispenser:
                    return new DispenserContainer(player, destructItems, inventory);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }
}
