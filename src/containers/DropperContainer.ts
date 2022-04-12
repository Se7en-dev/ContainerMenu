import { ContainerInventory, ContainerSize, FakeContainer } from "./FakeContainer";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";

export class DropperContainer extends FakeContainer {
    public constructor(player: ServerPlayer, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:dropper")!,
            ContainerType.Dropper,
            ContainerSize.Dropper,
            player,
            inventory
        );
    }
}