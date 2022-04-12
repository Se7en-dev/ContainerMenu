import { ContainerInventory, ContainerSize, FakeContainer } from "./FakeContainer";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";

export class DispenserContainer extends FakeContainer {
    public constructor(player: ServerPlayer, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:dispenser")!,
            ContainerType.Dispenser,
            ContainerSize.Dispenser,
            player,
            inventory
        );
    }
}