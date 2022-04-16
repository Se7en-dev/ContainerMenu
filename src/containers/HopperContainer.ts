import { ServerPlayer } from "bdsx/bds/player";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { FakeContainer } from "./FakeContainer";
import { ContainerInventory, ContainerSize } from "../ContainerMenu";

export class HopperContainer extends FakeContainer {
    public constructor(player: ServerPlayer, destructItems?: boolean, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:hopper")!,
            ContainerType.Hopper,
            ContainerSize.Hopper,
            player,
            destructItems,
            inventory
        );
    }
}