import { ContainerInventory, ContainerSize, FakeContainer } from "./FakeContainer";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";

export class ChestContainer extends FakeContainer {
    public constructor(player: ServerPlayer, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:chest")!,
            ContainerType.Container,
            ContainerSize.Chest,
            player,
            inventory
        );
    }
}