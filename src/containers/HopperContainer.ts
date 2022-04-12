import { ContainerInventory, ContainerSize, FakeContainer } from "./FakeContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";

export class HopperContainer extends FakeContainer {
    public constructor(player: ServerPlayer, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:hopper")!,
            ContainerType.Hopper,
            ContainerSize.Hopper,
            player,
            inventory
        );
    }
}